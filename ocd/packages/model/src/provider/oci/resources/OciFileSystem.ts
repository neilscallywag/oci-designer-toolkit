/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/OciFileSystem.js"

export interface OciFileSystem extends AutoGenerated.OciFileSystem {}

export namespace OciFileSystem {
    
    export function newResource(type?: string): OciFileSystem {
        const resource = {
            ...AutoGenerated.OciFileSystem.newResource('file_system'),
        }
        return resource
    }
    export function cloneResource(resource: OciFileSystem, type?: string): OciFileSystem {
        return AutoGenerated.OciFileSystem.cloneResource(resource, 'file_system') as OciFileSystem
    }
    export function allowedParentTypes(): string[] {
        return []
    }
    export function getParentId(resource: OciFileSystem): string {
        const parentId = resource.compartmentId
        return parentId
    }
    export function setParentId(resource: OciFileSystem, parentId: string): OciFileSystem {
        return resource
    }
    export function getConnectionIds(resource: OciFileSystem, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        return associationIds
    }
}

export class OciFileSystemClient extends AutoGenerated.OciFileSystemClient {
    static new(): OciFileSystem {
        return OciFileSystem.newResource()
    }
    static clone(resource: OciFileSystem): OciFileSystem {
        return OciFileSystem.cloneResource(resource)
    }
}

export default OciFileSystemClient
