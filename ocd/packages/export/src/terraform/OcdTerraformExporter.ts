/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdDesign, OcdVariable, OciResource } from "@ocd/model";
import { OcdExporter, OutputData } from "../OcdExporter";
import { OciModelResources as Model } from '@ocd/model'
import * as OciTerraformResources  from './provider/oci/resources'
import { OcdUtils } from "@ocd/core";

interface ResourceMap extends Record<string, string> {}

export class OcdTerraformExporter extends OcdExporter {
    terraform: string = ''
    resourceFileMap: ResourceMap = {
        bastion: "oci_identity.tf",
        compartment: "oci_identity.tf",
        group: "oci_identity.tf",
        key: "oci_identity.tf",
        user: "oci_identity.tf",
        vault: "oci_identity.tf",
        vault_secret: "oci_identity.tf",

        dhcp_options: "oci_networking.tf",
        drg: "oci_networking.tf",
        drg_attachment: "oci_networking.tf",
        internet_gateway: "oci_networking.tf",
        load_balancer: "oci_networking.tf",
        local_peering_gateway: "oci_networking.tf",
        nat_gateway: "oci_networking.tf",
        network_firewall: "oci_networking.tf",
        network_load_balancer: "oci_networking.tf",
        network_security_group: "oci_networking.tf",
        network_security_group_security_rule: "oci_networking.tf",
        remote_peering_connection: "oci_networking.tf",
        route_table: "oci_networking.tf",
        security_list: "oci_networking.tf",
        service_gateway: "oci_networking.tf",
        subnet: "oci_networking.tf",
        vcn: "oci_networking.tf",

        bucket: "oci_storage.tf",
        file_system: "oci_storage.tf",
        mount_target: "oci_storage.tf",
        volume: "oci_storage.tf",

        analytics_instance: "oci_compute.tf",
        autoscaling_configuration: "oci_compute.tf",
        data_science_project: "oci_compute.tf",
        instance: "oci_compute.tf",
        instance_configuration: "oci_compute.tf",
        instance_pool: "oci_compute.tf",
        oracle_digital_assistant: "oci_compute.tf",
        visual_builder_instance: "oci_compute.tf",

        autonomous_database: "oci_database.tf",
        db_system: "oci_database.tf",
        exadata_cloud_infrastructure: "oci_database.tf",
        mysql_db_system: "oci_database.tf",
        nosql_table: "oci_database.tf",

        cpe: "oci_customer.tf",
        ipsec_connection: "oci_customer.tf",

        oke_cluster: "oci_container",
        node_pool: "oci_container",

        unknown: "oci_unspecified.tf"
    }
    export = (design: OcdDesign): OutputData => {
        this.design = design
        const uniqueFilenames = [...new Set(Object.values(this.resourceFileMap))]
        let outputData: OutputData = {
            "oci_provider.tf": [this.ociProvider()],
            "oci_metadata.tf": [this.ociMetadata()],
            ...uniqueFilenames.sort().reduce((a, c) => {a[c] = [this.autoGeneratedNotice()]; return a}, {} as Record<string, string[]>),
            "oci_provider_variables.tf": [this.ociProviderVariables()],
            "oci_user_variables.tf": [this.ociUserVariables()],
        }
        // Id to Terraform Resource Name Map
        const idTFResourceMap: Record<string, string> = this.getResources().reduce((a, c) => {a[c.id] = c.terraformResourceName; return a}, {} as Record<string, string>)
        // Generate OCI Terraform
        Object.entries(design.model.oci.resources).forEach(([k, v]) => {
            const className = OcdUtils.toClassName('Oci', k)
            const filename = this.resourceFileMap.hasOwnProperty(k) ? this.resourceFileMap[k] : this.resourceFileMap['unknown']
            // @ts-ignore
            v.forEach((r: OciResource) => {
                // @ts-ignore 
                const tfResource = new OciTerraformResources[className](r, idTFResourceMap)
                if (!outputData.hasOwnProperty(filename)) outputData[filename] = [this.autoGeneratedNotice()]
                outputData[filename].push(tfResource.generate(r))
            })
        })
        // console.debug('OcdTerraformExporter: Output Data', outputData)
        const allResources: string[] = Object.values(outputData).reduce((a, c) => [...a, ...c], [])
        // console.debug('OcdTerraformExporter: All Resources', allResources)
        this.terraform = allResources.join('\n')
        console.debug('OcdTerraformExporter: Terraform', this.terraform)
        return outputData
    }
    ociProvider = () => {return `${this.autoGeneratedNotice()}
terraform {
    required_version = ">= 1.5.0"
}

# ------ Connect to Provider
provider "oci" {
    tenancy_ocid     = var.tenancy_ocid
    user_ocid        = var.user_ocid
    fingerprint      = var.fingerprint
    private_key_path = var.private_key_path
    region           = var.region
}

# ------ Home Region Provider
data "oci_identity_region_subscriptions" "HomeRegion" {
    tenancy_id = var.tenancy_ocid
    filter {
        name = "is_home_region"
        values = [true]
    }
}
locals {
    home_region = lookup(element(data.oci_identity_region_subscriptions.HomeRegion.region_subscriptions, 0), "region_name")
}

provider "oci" {
    alias            = "home_region"
    tenancy_ocid     = var.tenancy_ocid
    user_ocid        = var.user_ocid
    fingerprint      = var.fingerprint
    private_key_path = var.private_key_path
    region           = local.home_region
}

output "Home_Region_Name" {
    value = local.home_region
}
    `}
    ociProviderVariables = () => {return `${this.autoGeneratedNotice()}
variable "tenancy_ocid" {
    type = string
    description = "OCID of the Tenancy where the defined resources will be created."
}
variable "user_ocid" {
    type = string
    description = "OCID of the User who will create the defined resources."
}
variable "fingerprint" {
    type = string
    description = "Fingerprint associated with the Private Key File."
}
variable "private_key_path" {
    type = string
    description = "Path to the user_ocid users Private Key File."
}
variable "region" {
    type = string
    description = "Name of the Region where the defined resources will be created."
}
variable "compartment_ocid" {
    type = string
    description = "OCID of the Compartment where the defined resources will be created."
}
    `}
    ociMetadata = () => {return `${this.autoGeneratedNotice()}
# ----- Get Availability Domains
data "oci_identity_availability_domains" "AvailabilityDomains" {
    compartment_id = var.tenancy_ocid
}
# => Access via the "element" function will allow for wrap-arounf of the returned Availability Domain List. 
# => This will allow the same code to be used in 3 AD Regions and 1 AD Regions.
locals {
    ad-1_name = element(data.oci_identity_availability_domains.AvailabilityDomains.availability_domains, 0).name
    ad-2_name = element(data.oci_identity_availability_domains.AvailabilityDomains.availability_domains, 1).name
    ad-3_name = element(data.oci_identity_availability_domains.AvailabilityDomains.availability_domains, 2).name
    ad-1_id   = element(data.oci_identity_availability_domains.AvailabilityDomains.availability_domains, 0).id
    ad-2_id   = element(data.oci_identity_availability_domains.AvailabilityDomains.availability_domains, 1).id
    ad-3_id   = element(data.oci_identity_availability_domains.AvailabilityDomains.availability_domains, 2).id
}
# ------ Get All Service OCID
data "oci_core_services" "AllRegionServices" {
    filter {
        name = "cidr_block"
        values = ["all-*"]
        regex = true
    }
}
locals {
    all_services_id          = data.oci_core_services.AllRegionServices.services[0].id
    all_services_cidr_block  = data.oci_core_services.AllRegionServices.services[0].cidr_block
    all_services_destination = data.oci_core_services.AllRegionServices.services[0].cidr_block
}
# ------ Get Object Storage Service OCID
data "oci_core_services" "ObjectStorageRegionServices" {
    filter {
        name = "cidr_block"
        values = ["\\\\w*objectstorage"]
        regex = true
    }
}
locals {
    objectstorage_services_id          = data.oci_core_services.ObjectStorageRegionServices.services[0].id
    objectstorage_services_cidr_block  = data.oci_core_services.ObjectStorageRegionServices.services[0].cidr_block
    objectstorage_services_destination = data.oci_core_services.ObjectStorageRegionServices.services[0].cidr_block
}
    `}
    ociUserVariables = () => {return `${this.autoGeneratedNotice()}
${this.design.model.oci.vars.map((v) => this.variableStatement(v)).join('')}
    `}
    variableStatement = (v: OcdVariable) => {
        return `variable "${v.name}" {
    ${v.default !== '' ? `default = "${v.default}"` : ''}
    description = "${v.description}"
}
`
    }

    autoGeneratedNotice = () => {return`
# ======================================================================
# === Auto Generated Code All Edits Will Be Lost During Regeneration ===
# ======================================================================
    `}
}

export default OcdTerraformExporter
