/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/OciMysqlDbSystem.js"

export interface OciMysqlDbSystem extends AutoGenerated.OciMysqlDbSystem {}

export namespace OciMysqlDbSystem {
    export namespace BackupPolicy {
        export interface BackupPolicy extends AutoGenerated.OciMysqlDbSystem.BackupPolicy.BackupPolicy {}
        export function newBackupPolicy(): BackupPolicy {return AutoGenerated.OciMysqlDbSystem.BackupPolicy.newBackupPolicy()}
        export namespace PitrPolicy {
            export interface PitrPolicy extends AutoGenerated.OciMysqlDbSystem.BackupPolicy.PitrPolicy.PitrPolicy {}
            export function newPitrPolicy(): PitrPolicy {return AutoGenerated.OciMysqlDbSystem.BackupPolicy.PitrPolicy.newPitrPolicy()}
            
        }
    }
    export namespace DeletionPolicy {
        export interface DeletionPolicy extends AutoGenerated.OciMysqlDbSystem.DeletionPolicy.DeletionPolicy {}
        export function newDeletionPolicy(): DeletionPolicy {return AutoGenerated.OciMysqlDbSystem.DeletionPolicy.newDeletionPolicy()}
        
    }
    export namespace Maintenance {
        export interface Maintenance extends AutoGenerated.OciMysqlDbSystem.Maintenance.Maintenance {}
        export function newMaintenance(): Maintenance {return AutoGenerated.OciMysqlDbSystem.Maintenance.newMaintenance()}
        
    }
    export namespace Source {
        export interface Source extends AutoGenerated.OciMysqlDbSystem.Source.Source {}
        export function newSource(): Source {return AutoGenerated.OciMysqlDbSystem.Source.newSource()}
        
    }
    export function newResource(type?: string): OciMysqlDbSystem {
        const resource = {
            ...AutoGenerated.OciMysqlDbSystem.newResource('mysql_db_system'),
        }
        return resource
    }
    export function cloneResource(resource: OciMysqlDbSystem, type?: string): OciMysqlDbSystem {
        return AutoGenerated.OciMysqlDbSystem.cloneResource(resource, 'mysql_db_system') as OciMysqlDbSystem
    }
    export function allowedParentTypes(): string[] {
        return []
    }
    export function getParentId(resource: OciMysqlDbSystem): string {
        const parentId = resource.compartmentId
        return parentId
    }
    export function setParentId(resource: OciMysqlDbSystem, parentId: string): OciMysqlDbSystem {
        return resource
    }
    export function getConnectionIds(resource: OciMysqlDbSystem, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        return associationIds
    }
}

export class OciMysqlDbSystemClient extends AutoGenerated.OciMysqlDbSystemClient {
    static new(): OciMysqlDbSystem {
        return OciMysqlDbSystem.newResource()
    }
    static clone(resource: OciMysqlDbSystem): OciMysqlDbSystem {
        return OciMysqlDbSystem.cloneResource(resource)
    }
}

export default OciMysqlDbSystemClient
