/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { OcdDesign, OciResource } from "@ocd/model"
import * as AutoGenerated from "./generated/OciNetworkSecurityGroupSecurityRule"

export class OciNetworkSecurityGroupSecurityRule extends AutoGenerated.OciNetworkSecurityGroupSecurityRule {
    commonAssignments = (resource: OciResource) => {
        // console.debug('OciNetworkSecurityGroupSecurityRule:', resource, resource.resourceType, this.typeDisplayNameMap, this.typeDisplayNameMap.hasOwnProperty(resource.resourceType))
        return `${this.homeRegion()}
`
    }
    tags = (resource: OciResource, design: OcdDesign): string => ''
}

export default OciNetworkSecurityGroupSecurityRule
