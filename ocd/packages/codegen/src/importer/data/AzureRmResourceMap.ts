/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdIncludedElements, OcdResourceMap } from "../../types/OcdImporterData";

export const resourceMap: OcdResourceMap = {
    "azurerm_application_load_balancer": "load_balancer",
    "azurerm_container_registry": "container_registry",
    "azurerm_dns_zone": "dns_zone",
    "azurerm_kubernetes_cluster": "kubernetes_cluster",
    "azurerm_subnet": "subnet",
    "azurerm_virtual_machine": "virtual_machine",
    "azurerm_virtual_network": "virtual_network",
}

export const dataMap: OcdResourceMap = {}

export const resourceAttributes: OcdIncludedElements = {
    "common": [
        "location",
        "name",
        "resource_group_name",
        "tags"
    ],
    "azurerm_application_load_balancer": [
        "primary_configuration_endpoint"
    ],
    "azurerm_container_registry": [
        "admin_enabled",
        "admin_password",
        "admin_username"
    ],
    "azurerm_dns_zone": [
        "max_number_of_record_sets",
        "name_servers"
    ],
    "azurerm_kubernetes_cluster":[
        "kubernetes_version",
        "private_dns_zone_id"
    ],
    "azurerm_subnet": [
        "virtual_network_name"
    ],
    "azurerm_virtual_machine": [
        "license_type"
    ],
    "azurerm_virtual_network": [
        "address_space",
        "dns_servers",
    ]
}
