/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/OciBootVolumeAttachment.js"

export interface OciBootVolumeAttachment extends AutoGenerated.OciBootVolumeAttachment {}

export namespace OciBootVolumeAttachment {
    
    export function newResource(type?: string): OciBootVolumeAttachment {
        const resource = {
            ...AutoGenerated.OciBootVolumeAttachment.newResource('boot_volume_attachment'),
        }
        return resource
    }
    export function cloneResource(resource: OciBootVolumeAttachment, type?: string): OciBootVolumeAttachment {
        return AutoGenerated.OciBootVolumeAttachment.cloneResource(resource, 'boot_volume_attachment') as OciBootVolumeAttachment
    }
    export function allowedParentTypes(): string[] {
        return []
    }
    export function getParentId(resource: OciBootVolumeAttachment): string {
        const parentId = resource.compartmentId
        return parentId
    }
    export function setParentId(resource: OciBootVolumeAttachment, parentId: string): OciBootVolumeAttachment {
        return resource
    }
    export function getConnectionIds(resource: OciBootVolumeAttachment, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        return associationIds
    }
}

export class OciBootVolumeAttachmentClient extends AutoGenerated.OciBootVolumeAttachmentClient {
    static new(): OciBootVolumeAttachment {
        return OciBootVolumeAttachment.newResource()
    }
    static clone(resource: OciBootVolumeAttachment): OciBootVolumeAttachment {
        return OciBootVolumeAttachment.cloneResource(resource)
    }
}

export default OciBootVolumeAttachmentClient
