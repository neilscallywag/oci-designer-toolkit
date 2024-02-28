/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign"
import * as AutoGenerated from "./generated/OciMysqlDbSystem"

export interface OciMysqlDbSystem extends AutoGenerated.OciMysqlDbSystem {}

export interface OciBackupPolicy extends AutoGenerated.OciBackupPolicy {}

export interface OciPitrPolicy extends AutoGenerated.OciPitrPolicy {}

export interface OciDeletionPolicy extends AutoGenerated.OciDeletionPolicy {}

export interface OciMaintenance extends AutoGenerated.OciMaintenance {}

export interface OciSource extends AutoGenerated.OciSource {}

export namespace OciMysqlDbSystem {
    
    export interface OciBackupPolicy extends AutoGenerated.OciMysqlDbSystem.OciBackupPolicy {}

    export interface OciPitrPolicy extends AutoGenerated.OciMysqlDbSystem.OciPitrPolicy {}

    export interface OciDeletionPolicy extends AutoGenerated.OciMysqlDbSystem.OciDeletionPolicy {}

    export interface OciMaintenance extends AutoGenerated.OciMysqlDbSystem.OciMaintenance {}

    export interface OciSource extends AutoGenerated.OciMysqlDbSystem.OciSource {}

    export function newResource(type?: string): OciMysqlDbSystem {
        return {
            ...AutoGenerated.OciMysqlDbSystem.newResource('mysql_db_system'),
        }
    }
    export function cloneResource(resource: OciMysqlDbSystem, type?: string): OciMysqlDbSystem {
        return AutoGenerated.OciMysqlDbSystem.cloneResource(resource, 'mysql_db_system') as OciMysqlDbSystem
    }
    export function allowedParentTypes(): string[] {
        // console.debug('OciMysqlDbSystem: Allowed Parent Types')
        return []
    }
    export function getParentId(resource: OciMysqlDbSystem): string {
        // console.debug('OciMysqlDbSystem: Getting Parent Id to for', resource.displayName, resource.id)
        return resource.compartmentId
    }
    export function setParentId(resource: OciMysqlDbSystem, parentId: string): OciMysqlDbSystem {
        // console.debug('OciMysqlDbSystem: Setting Parent Id to', parentId, 'for', resource.displayName, resource.id)
        return resource
    }
    export function getConnectionIds(resource: OciMysqlDbSystem, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        // console.debug('OciMysqlDbSystem: Getting Connection Ids to for', resource.displayName, resource.id)
        return []
    }
    
    export function newOciBackupPolicy(): OciBackupPolicy {
        return {
            ...AutoGenerated.OciMysqlDbSystem.newOciBackupPolicy(),
        }
    }

    export function newOciPitrPolicy(): OciPitrPolicy {
        return {
            ...AutoGenerated.OciMysqlDbSystem.newOciPitrPolicy(),
        }
    }

    export function newOciDeletionPolicy(): OciDeletionPolicy {
        return {
            ...AutoGenerated.OciMysqlDbSystem.newOciDeletionPolicy(),
        }
    }

    export function newOciMaintenance(): OciMaintenance {
        return {
            ...AutoGenerated.OciMysqlDbSystem.newOciMaintenance(),
        }
    }

    export function newOciSource(): OciSource {
        return {
            ...AutoGenerated.OciMysqlDbSystem.newOciSource(),
        }
    }

}

export class OciMysqlDbSystemClient {
    static new(): OciMysqlDbSystem {
        return OciMysqlDbSystem.newResource()
    }
    static clone(resource: OciMysqlDbSystem): OciMysqlDbSystem {
        return OciMysqlDbSystem.cloneResource(resource)
    }
}

export default OciMysqlDbSystemClient
