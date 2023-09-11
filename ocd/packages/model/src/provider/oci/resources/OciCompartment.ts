/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import * as AutoGenerated from "./generated/OciCompartment"

export interface OciCompartment extends AutoGenerated.OciCompartment {}

export namespace OciCompartment {
    
    export function newResource(type?: string): OciCompartment {
        return {
            ...AutoGenerated.OciCompartment.newResource('compartment'),
        }
    }
    export function cloneResource(resource: OciCompartment, type?: string): OciCompartment {
        return AutoGenerated.OciCompartment.cloneResource(resource, 'compartment') as OciCompartment
    }
    export function allowedParentTypes(): string[] {
        console.debug('OciCompartment: Allowed Parent Types')
        return []
    }
    export function getParentId(resource: OciCompartment): string {
        console.debug('OciCompartment: Getting Parent Id to for', resource.displayName, resource.id)
        return resource.compartmentId
    }
    export function setParentId(resource: OciCompartment, parentId: string): OciCompartment {
        console.debug('OciCompartment: Setting Parent Id to', parentId, 'for', resource.displayName, resource.id)
        return resource
    }
    export function getConnectionIds(resource: OciCompartment): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        console.debug('OciCompartment: Getting Connection Ids to for', resource.displayName, resource.id)
        return []
    }
    
}

export class OciCompartmentClient {
    static new(): OciCompartment {
        return OciCompartment.newResource()
    }
    static clone(resource: OciCompartment): OciCompartment {
        return OciCompartment.cloneResource(resource)
    }
}

export default OciCompartmentClient
