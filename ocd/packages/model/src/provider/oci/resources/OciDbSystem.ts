/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign"
import * as AutoGenerated from "./generated/OciDbSystem"

export interface OciDbSystem extends AutoGenerated.OciDbSystem {}

export interface OciDataCollectionOptions extends AutoGenerated.OciDataCollectionOptions {}

export interface OciDbHome extends AutoGenerated.OciDbHome {}

export interface OciDatabase extends AutoGenerated.OciDatabase {}

export interface OciDbBackupConfig extends AutoGenerated.OciDbBackupConfig {}

export interface OciBackupDestinationDetails extends AutoGenerated.OciBackupDestinationDetails {}

export interface OciDbSystemOptions extends AutoGenerated.OciDbSystemOptions {}

export interface OciMaintenanceWindowDetails extends AutoGenerated.OciMaintenanceWindowDetails {}

export interface OciDaysOfWeek extends AutoGenerated.OciDaysOfWeek {}

export interface OciMonths extends AutoGenerated.OciMonths {}

export namespace OciDbSystem {
    
    export interface OciDataCollectionOptions extends AutoGenerated.OciDbSystem.OciDataCollectionOptions {}

    export interface OciDbHome extends AutoGenerated.OciDbSystem.OciDbHome {}

    export interface OciDatabase extends AutoGenerated.OciDbSystem.OciDatabase {}

    export interface OciDbBackupConfig extends AutoGenerated.OciDbSystem.OciDbBackupConfig {}

    export interface OciBackupDestinationDetails extends AutoGenerated.OciDbSystem.OciBackupDestinationDetails {}

    export interface OciDbSystemOptions extends AutoGenerated.OciDbSystem.OciDbSystemOptions {}

    export interface OciMaintenanceWindowDetails extends AutoGenerated.OciDbSystem.OciMaintenanceWindowDetails {}

    export interface OciDaysOfWeek extends AutoGenerated.OciDbSystem.OciDaysOfWeek {}

    export interface OciMonths extends AutoGenerated.OciDbSystem.OciMonths {}

    export function newResource(type?: string): OciDbSystem {
        return {
            ...AutoGenerated.OciDbSystem.newResource('db_system'),
        }
    }
    export function cloneResource(resource: OciDbSystem, type?: string): OciDbSystem {
        return AutoGenerated.OciDbSystem.cloneResource(resource, 'db_system') as OciDbSystem
    }
    export function allowedParentTypes(): string[] {
        // console.debug('OciDbSystem: Allowed Parent Types')
        return []
    }
    export function getParentId(resource: OciDbSystem): string {
        // console.debug('OciDbSystem: Getting Parent Id to for', resource.displayName, resource.id)
        return resource.compartmentId
    }
    export function setParentId(resource: OciDbSystem, parentId: string): OciDbSystem {
        // console.debug('OciDbSystem: Setting Parent Id to', parentId, 'for', resource.displayName, resource.id)
        return resource
    }
    export function getConnectionIds(resource: OciDbSystem, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        // console.debug('OciDbSystem: Getting Connection Ids to for', resource.displayName, resource.id)
        return []
    }
    
    export function newOciDataCollectionOptions(): OciDataCollectionOptions {
        return {
            ...AutoGenerated.OciDbSystem.newOciDataCollectionOptions(),
        }
    }

    export function newOciDbHome(): OciDbHome {
        return {
            ...AutoGenerated.OciDbSystem.newOciDbHome(),
        }
    }

    export function newOciDatabase(): OciDatabase {
        return {
            ...AutoGenerated.OciDbSystem.newOciDatabase(),
        }
    }

    export function newOciDbBackupConfig(): OciDbBackupConfig {
        return {
            ...AutoGenerated.OciDbSystem.newOciDbBackupConfig(),
        }
    }

    export function newOciBackupDestinationDetails(): OciBackupDestinationDetails {
        return {
            ...AutoGenerated.OciDbSystem.newOciBackupDestinationDetails(),
        }
    }

    export function newOciDbSystemOptions(): OciDbSystemOptions {
        return {
            ...AutoGenerated.OciDbSystem.newOciDbSystemOptions(),
        }
    }

    export function newOciMaintenanceWindowDetails(): OciMaintenanceWindowDetails {
        return {
            ...AutoGenerated.OciDbSystem.newOciMaintenanceWindowDetails(),
        }
    }

    export function newOciDaysOfWeek(): OciDaysOfWeek {
        return {
            ...AutoGenerated.OciDbSystem.newOciDaysOfWeek(),
        }
    }

    export function newOciMonths(): OciMonths {
        return {
            ...AutoGenerated.OciDbSystem.newOciMonths(),
        }
    }

}

export class OciDbSystemClient {
    static new(): OciDbSystem {
        return OciDbSystem.newResource()
    }
    static clone(resource: OciDbSystem): OciDbSystem {
        return OciDbSystem.cloneResource(resource)
    }
}

export default OciDbSystemClient
