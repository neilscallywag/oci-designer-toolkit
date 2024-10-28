/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { ResourceElementConfig } from "../../../../OcdPropertyTypes"
import { GoogleCommonConfigs } from "../../GoogleCommonConfigs"

export namespace GoogleOracleDatabaseCloudVmClusterConfigs {
    export function configs(): ResourceElementConfig[] {return [...GoogleCommonConfigs.configs()]}
}
