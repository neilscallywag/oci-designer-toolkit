/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/OciCpe.js"

export interface OciCpe extends AutoGenerated.OciCpe {}

export namespace OciCpe {
    
    export function newResource(type?: string): OciCpe {
        const resource = {
            ...AutoGenerated.OciCpe.newResource('cpe'),
        }
        return resource
    }
    export function cloneResource(resource: OciCpe, type?: string): OciCpe {
        return AutoGenerated.OciCpe.cloneResource(resource, 'cpe') as OciCpe
    }
    export function allowedParentTypes(): string[] {
        return []
    }
    export function getParentId(resource: OciCpe): string {
        const parentId = resource.compartmentId
        return parentId
    }
    export function setParentId(resource: OciCpe, parentId: string): OciCpe {
        return resource
    }
    export function getConnectionIds(resource: OciCpe, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        return associationIds
    }
}

export class OciCpeClient extends AutoGenerated.OciCpeClient {
    static new(): OciCpe {
        return OciCpe.newResource()
    }
    static clone(resource: OciCpe): OciCpe {
        return OciCpe.cloneResource(resource)
    }
}

export default OciCpeClient
