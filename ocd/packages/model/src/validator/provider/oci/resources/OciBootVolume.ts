/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import * as AutoGenerated from './generated/OciBootVolume.js'
import * as Model from '../../../../provider/oci/resources.js'
import { OciResources } from '../../../../OcdDesign.js'
import { OcdValidationResult } from '../../../OcdResourceValidator.js'

export namespace OciBootVolume {
    export function validateResource(resource: Model.OciBootVolume, resources: OciResources): OcdValidationResult[] {
        return [...AutoGenerated.OciBootVolume.validateResource(resource, resources), ...customValidation(resource, resources)]
    }
    export function isResourceValid(resource: Model.OciBootVolume, resources: OciResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => !v.valid).length > 0)
    }
    export function hasErrors(resource: Model.OciBootVolume, resources: OciResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'error').length > 0)
    }
    export function hasWarnings(resource: Model.OciBootVolume, resources: OciResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'warning').length > 0)
    }
    export function hasInformation(resource: Model.OciBootVolume, resources: OciResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'information').length > 0)
    }
    function customValidation(resource: Model.OciBootVolume, resources: OciResources): OcdValidationResult[] {
        const results: OcdValidationResult[] = []
        return results
    }
}
