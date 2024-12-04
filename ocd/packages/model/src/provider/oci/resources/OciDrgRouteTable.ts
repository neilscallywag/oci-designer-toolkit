/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdResources } from "../../../OcdDesign.js"
import * as AutoGenerated from "./generated/OciDrgRouteTable.js"

export interface OciDrgRouteTable extends AutoGenerated.OciDrgRouteTable {}

export namespace OciDrgRouteTable {
    
    export function newResource(type?: string): OciDrgRouteTable {
        const resource = {
            ...AutoGenerated.OciDrgRouteTable.newResource('drg_route_table'),
        }
        return resource
    }
    export function cloneResource(resource: OciDrgRouteTable, type?: string): OciDrgRouteTable {
        return AutoGenerated.OciDrgRouteTable.cloneResource(resource, 'drg_route_table') as OciDrgRouteTable
    }
    export function allowedParentTypes(): string[] {
        return []
    }
    export function getParentId(resource: OciDrgRouteTable): string {
        const parentId = resource.compartmentId
        return parentId
    }
    export function setParentId(resource: OciDrgRouteTable, parentId: string): OciDrgRouteTable {
        return resource
    }
    export function getConnectionIds(resource: OciDrgRouteTable, allResources: OcdResources): string[] {
        // This List of Ids does not include the Parent Id or Compartment Id
        let associationIds: string[] = []
        return associationIds
    }
}

export class OciDrgRouteTableClient extends AutoGenerated.OciDrgRouteTableClient {
    static new(): OciDrgRouteTable {
        return OciDrgRouteTable.newResource()
    }
    static clone(resource: OciDrgRouteTable): OciDrgRouteTable {
        return OciDrgRouteTable.cloneResource(resource)
    }
}

export default OciDrgRouteTableClient
