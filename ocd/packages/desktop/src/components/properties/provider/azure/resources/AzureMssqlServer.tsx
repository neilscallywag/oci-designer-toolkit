/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import OcdDocument from '../../../../OcdDocument.js'
import { ResourceElementConfig, ResourceProperties } from '../../../OcdPropertyTypes.js'
import * as AutoGenerated from './generated/AzureMssqlServer.js'
import { AzureMssqlServerConfigs } from './configs/AzureMssqlServer.js'

export const AzureMssqlServer = ({ ocdDocument, setOcdDocument, resource }: ResourceProperties): JSX.Element => {
    const configs: ResourceElementConfig[] = AzureMssqlServerConfigs.configs()
    return (
        <AutoGenerated.AzureMssqlServer ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} configs={configs} key={`${resource.id}.AutoGenerated.AzureMssqlServer`} />
    )
}
