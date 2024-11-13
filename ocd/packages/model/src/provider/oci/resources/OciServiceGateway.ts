/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/OciServiceGateway.js"

export interface OciServiceGateway extends AutoGenerated.OciServiceGateway {}

export namespace OciServiceGateway {
    export namespace Services {
        export interface Services extends AutoGenerated.OciServiceGateway.Services.Services {}
        export function newServices(): Services {return AutoGenerated.OciServiceGateway.Services.newServices()}
        
    }
    export function newResource(type?: string): OciServiceGateway {
        const resource = {
            ...AutoGenerated.OciServiceGateway.newResource('service_gateway'),
        }
        return resource
    }
    export function cloneResource(resource: OciServiceGateway, type?: string): OciServiceGateway {
        return AutoGenerated.OciServiceGateway.cloneResource(resource, 'service_gateway') as OciServiceGateway
    }
    export function allowedParentTypes(): string[] {
        return ['Vcn']
    }
    export function getParentId(resource: OciServiceGateway): string {
        const parentId = resource.vcnId !== '' ? resource.vcnId as string : resource.compartmentId
        return parentId
    }
    export function setParentId(resource: OciServiceGateway, parentId: string): OciServiceGateway {
        resource.vcnId = parentId
        return resource
    }
    export function getConnectionIds(resource: OciServiceGateway, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        if (resource.routeTableId && resource.routeTableId !== '') associationIds =  [...associationIds, resource.routeTableId]
        return associationIds
    }
}

export class OciServiceGatewayClient extends AutoGenerated.OciServiceGatewayClient {
    static new(): OciServiceGateway {
        return OciServiceGateway.newResource()
    }
    static clone(resource: OciServiceGateway): OciServiceGateway {
        return OciServiceGateway.cloneResource(resource)
    }
}

export default OciServiceGatewayClient
