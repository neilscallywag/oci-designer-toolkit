/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/OciBastion.js"

export interface OciBastion extends AutoGenerated.OciBastion {}

export namespace OciBastion {
    
    export function newResource(type?: string): OciBastion {
        const resource = {
            ...AutoGenerated.OciBastion.newResource('bastion'),
        }
        return resource
    }
    export function cloneResource(resource: OciBastion, type?: string): OciBastion {
        return AutoGenerated.OciBastion.cloneResource(resource, 'bastion') as OciBastion
    }
    export function allowedParentTypes(): string[] {
        return []
    }
    export function getParentId(resource: OciBastion): string {
        const parentId = resource.compartmentId
        return parentId
    }
    export function setParentId(resource: OciBastion, parentId: string): OciBastion {
        return resource
    }
    export function getConnectionIds(resource: OciBastion, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        return associationIds
    }
}

export class OciBastionClient extends AutoGenerated.OciBastionClient {
    static new(): OciBastion {
        return OciBastion.newResource()
    }
    static clone(resource: OciBastion): OciBastion {
        return OciBastion.cloneResource(resource)
    }
}

export default OciBastionClient
