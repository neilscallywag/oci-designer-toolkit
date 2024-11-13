/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import * as AutoGenerated from './generated/GoogleOracleDatabaseAutonomousDatabase.js'
import * as Model from '../../../../provider/google/resources.js'
import { GoogleResources } from '../../../../OcdDesign.js'
import { OcdValidationResult } from '../../../OcdResourceValidator.js'

export namespace GoogleOracleDatabaseAutonomousDatabase {
    export function validateResource(resource: Model.GoogleOracleDatabaseAutonomousDatabase, resources: GoogleResources): OcdValidationResult[] {
        return [...AutoGenerated.GoogleOracleDatabaseAutonomousDatabase.validateResource(resource, resources), ...customValidation(resource, resources)]
    }
    export function isResourceValid(resource: Model.GoogleOracleDatabaseAutonomousDatabase, resources: GoogleResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => !v.valid).length > 0)
    }
    export function hasErrors(resource: Model.GoogleOracleDatabaseAutonomousDatabase, resources: GoogleResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'error').length > 0)
    }
    export function hasWarnings(resource: Model.GoogleOracleDatabaseAutonomousDatabase, resources: GoogleResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'warning').length > 0)
    }
    export function hasInformation(resource: Model.GoogleOracleDatabaseAutonomousDatabase, resources: GoogleResources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'information').length > 0)
    }
    function customValidation(resource: Model.GoogleOracleDatabaseAutonomousDatabase, resources: GoogleResources): OcdValidationResult[] {
        const results: OcdValidationResult[] = []
        return results
    }
}
