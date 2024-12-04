/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/AzureOracleCloudVmCluster.js"

export interface AzureOracleCloudVmCluster extends AutoGenerated.AzureOracleCloudVmCluster {}

export namespace AzureOracleCloudVmCluster {
    
    export function newResource(type?: string): AzureOracleCloudVmCluster {
        const resource = {
            ...AutoGenerated.AzureOracleCloudVmCluster.newResource('oracle_cloud_vm_cluster'),
        }
        return resource
    }
    export function cloneResource(resource: AzureOracleCloudVmCluster, type?: string): AzureOracleCloudVmCluster {
        return AutoGenerated.AzureOracleCloudVmCluster.cloneResource(resource, 'oracle_cloud_vm_cluster') as AzureOracleCloudVmCluster
    }
    export function allowedParentTypes(): string[] {
        return []
    }
    export function getParentId(resource: AzureOracleCloudVmCluster): string {
        const parentId = resource.compartmentId
        return parentId
    }
    export function setParentId(resource: AzureOracleCloudVmCluster, parentId: string): AzureOracleCloudVmCluster {
        return resource
    }
    export function getConnectionIds(resource: AzureOracleCloudVmCluster, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        return associationIds
    }
}

export class AzureOracleCloudVmClusterClient extends AutoGenerated.AzureOracleCloudVmClusterClient {
    static new(): AzureOracleCloudVmCluster {
        return AzureOracleCloudVmCluster.newResource()
    }
    static clone(resource: AzureOracleCloudVmCluster): AzureOracleCloudVmCluster {
        return AzureOracleCloudVmCluster.cloneResource(resource)
    }
}

export default AzureOracleCloudVmClusterClient
