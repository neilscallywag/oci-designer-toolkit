/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import * as AutoGenerated from "./generated/OciRemotePeeringConnectionModel"

export interface OciRemotePeeringConnectionModel extends AutoGenerated.OciRemotePeeringConnectionAutoGeneratedModel {}

export namespace OciRemotePeeringConnectionModel {
    export function newResource(type?: string): OciRemotePeeringConnectionModel {
        return {
            ...AutoGenerated.OciRemotePeeringConnectionAutoGeneratedModel.newResource('remote_peering_connection'),
        }
    }
    
}

export class OciRemotePeeringConnectionModelClient {
    static new(): OciRemotePeeringConnectionModel {
        return OciRemotePeeringConnectionModel.newResource()
    }
}

export default OciRemotePeeringConnectionModelClient
