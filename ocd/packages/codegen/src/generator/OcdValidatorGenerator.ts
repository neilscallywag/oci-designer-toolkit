/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
// TODO: Remove Following
// @ts-nocheck

import { OcdCodeGenerator } from './OcdCodeGenerator.js'

export class OcdValidatorGenerator extends OcdCodeGenerator {
    constructor (prefix: string='${this.prefix}') {
        super(prefix)
        this.ignoreAttributes = [...this.commonElements, ...this.commonIgnoreElements]
    }
    /*
    ** Content for the top level file. This will only be created if it does not exists.
    */
    content = (resource, schema) => {
        const content = `${this.copyright()}

import * as AutoGenerated from './${this.generatedDirectory()}/${this.validatorResourceName(resource)}.js'
import * as Model from '../../../../provider/${this.prefix.toLowerCase()}/resources.js'
import { ${this.prefix}Resources } from '../../../../OcdDesign.js'
import { OcdValidationResult } from '../../../OcdResourceValidator.js'

export namespace ${this.idToNamespaceName(resource)} {
    export function validateResource(resource: Model.${this.idToInterfaceName(resource)}, resources: ${this.prefix}Resources): OcdValidationResult[] {
        return [...AutoGenerated.${this.idToNamespaceName(resource)}.validateResource(resource, resources), ...customValidation(resource, resources)]
    }
    export function isResourceValid(resource: Model.${this.idToInterfaceName(resource)}, resources: ${this.prefix}Resources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => !v.valid).length > 0)
    }
    export function hasErrors(resource: Model.${this.idToInterfaceName(resource)}, resources: ${this.prefix}Resources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'error').length > 0)
    }
    export function hasWarnings(resource: Model.${this.idToInterfaceName(resource)}, resources: ${this.prefix}Resources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'warning').length > 0)
    }
    export function hasInformation(resource: Model.${this.idToInterfaceName(resource)}, resources: ${this.prefix}Resources): boolean {
        return (validateResource(resource, resources).filter((v: OcdValidationResult) => v.type === 'information').length > 0)
    }
    function customValidation(resource: Model.${this.idToInterfaceName(resource)}, resources: ${this.prefix}Resources): OcdValidationResult[] {
        const results: OcdValidationResult[] = []
        return results
    }
}
`
        return content
    }

    /*
    ** Content for the auto generated file this will be written on each execution.
    */
    autoGeneratedContent = (resource, schema) => {
        const schemaObjects = this.getSchemaObjects(schema)
        const schemaAttributes = this.getSchemaAttributes(schema)
        // if (resource === 'bucket') console.info('Schema Objects', schemaObjects)
        // if (resource === 'bucket') console.info('Schema Attributes', schemaAttributes)
        const content = `${this.copyright()}
${this.autoGeneratedWarning()}
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as Model from '../../../../../provider/${this.prefix.toLowerCase()}/resources.js'
import { ${this.prefix}Resource } from '../../../../../provider/${this.prefix.toLowerCase()}/${this.prefix}Resource.js'
import { ${this.prefix}Resources } from '../../../../../OcdDesign.js'
import { OcdResourceValidator, OcdValidationResult, OcdValidatorResource } from '../../../../OcdResourceValidator.js'

export namespace ${this.idToNamespaceName(resource)} {
    export function validateResource(resource: Model.${this.idToInterfaceName(resource)}, resources: ${this.prefix}Resources): OcdValidationResult[] {
        const displayName = resource.displayName
        const results: OcdValidationResult[] = [
            ${Object.entries(schema.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(v.id)).map(([k, a]) => this.attributeToValidatorAssignment(resource, k, a)).join(',\n            ')}
        ]
        return results
    }

    ${schemaAttributes.filter(a => !this.ignoreAttributes.includes(a.id)).map(i => this.validatorSimpleElement(resource, i)).filter(i => i.trim() !== '').join('\n    ')}
    ${schemaObjects.map(i => this.validatorComplexElement(resource, i)).filter(i => i.trim() !== '').join('\n    ')}
}


`
        return content
    }

    /*
    ** Content for the auto generated resource summary file this will be written on each execution.
    */

    attributeToValidatorAssignment = (resource, name, attribute, level=0) => {
        if (attribute.type === 'string' && attribute.lookup)                  return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else if (attribute.type === 'string')                                 return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else if (attribute.type === 'bool')                                   return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else if (attribute.type === 'number')                                 return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else if (attribute.type === 'list' && attribute.subtype === 'string') return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else if (attribute.type === 'object')                                 return `...OcdResourceValidator.isPropertyValidationConditionTrue(${attribute.conditional}, ${JSON.stringify(attribute.condition)}, resource) ? ${this.validatorObjectName(attribute.id)}(resource.${this.modelElementName(attribute.name)}, resources, displayName) : []`
        else if (attribute.type === 'list' && attribute.subtype === 'object') return `...${this.validatorObjectListName(attribute.id)}(resource.${this.modelElementName(attribute.name)}, resources, displayName)`
        else if (attribute.type === 'list' && attribute.lookup) return `${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else if (attribute.type === 'set')    return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else if (attribute.type === 'map')    return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
        else return `...${this.validatorSimpleName(attribute.id)}(resource, resources, displayName)`
    }

    validatorSimpleElementType = (resource, name, attribute, level=0) => {
        // if (resource === 'bucket') console.debug(`${name}:`, attribute)
        if (attribute.required) {
            if (attribute.type === 'string')      return `OcdResourceValidator.validateRequiredText(displayName, '${name}', resource.${this.toCamelCase(name)}, '${attribute.label}', '${this.cssClassName(resource)}', resources)`
            else if (attribute.type === 'bool')   return `OcdResourceValidator.validateRequiredBoolean(displayName, '${name}', resource.${this.toCamelCase(name)}, '${attribute.label}', '${this.cssClassName(resource)}', resources)`
            else if (attribute.type === 'number') return `OcdResourceValidator.validateRequiredNumber(displayName, '${name}', resource.${this.toCamelCase(name)}, '${attribute.label}', '${this.cssClassName(resource)}', resources)`
            else if (attribute.type === 'list' && attribute.subtype === 'string') return `OcdResourceValidator.validateRequiredStringList(displayName, '${name}', resource.${this.toCamelCase(name)}, '${attribute.label}', '${this.cssClassName(resource)}',resources)`
            // else return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${this.toCamelCase(name)} Type ${attribute.type} Required ${attribute.required}', resources)`    
            else return ''
        } else {
            // if (attribute.type === 'string' && attribute.lookup)      return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${attribute.label}', resources)`
            // else if (attribute.type === 'string')                     return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${attribute.label}', resources)`
            // else if (attribute.type === 'bool')                       return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${attribute.label}', resources)`
            // else if (attribute.type === 'number')                     return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${attribute.label}', resources)`
            // else if (attribute.type === 'list' && attribute.lookup)   return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${attribute.label}', resources)`
            // else if (attribute.type === 'list' && attribute.subtype === 'string') return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${attribute.label}', resources)`
            // // else if (attribute.type === 'object') return `${this.toCamelCase(name)}: ${this.autoGeneratedNamespaceName(resource)}.${this.namespaceFunctionName(name)}()`
            // // else if (attribute.type === 'list')   return `${this.toCamelCase(name)}: []`
            // // else if (attribute.type === 'set')    return `${this.toCamelCase(name)}: []`
            // // else if (attribute.type === 'map')    return `${this.toCamelCase(name)}: {}`
            // else return `OcdResourceValidator.noDefaultValidation("${name}", resource.${this.toCamelCase(name)}, '${this.toCamelCase(name)} Type ${attribute.type} Required ${attribute.required}', resources)`    
            return ''
        }
    }

    validatorSimpleElement = (resource, attribute, level=0) => {
        const simpleTypes = ['string', 'bool', 'number']
        const groupTypes = ['list', 'set', 'map']
        if (simpleTypes.includes(attribute.type) || (groupTypes.includes(attribute.type) && simpleTypes.includes(attribute.subtype))) {
            return `const ${this.validatorSimpleName(attribute.id)} = (resource: OcdValidatorResource, resources: ${this.prefix}Resources, displayName=''): OcdValidationResult[] => {return [${this.validatorSimpleElementType(resource, attribute.name, attribute)}]}`
        } else {
            return `const ${this.validatorSimpleName(attribute.id)} = (resource: OcdValidatorResource, resources: ${this.prefix}Resources, displayName=''): OcdValidationResult[] => {return [${this.validatorSimpleElementType(resource, attribute.name, attribute)}]}`
        }
    }

    validatorComplexElement = (resource, attribute) => {
        if (attribute.type === 'object') return this.validatorObjectElement(resource, attribute)
        else if (attribute.type === 'list' && attribute.subtype === 'object') return this.validatorObjectListElement(resource, attribute)
        else return ``
    }

    validatorObjectElement = (resource, attribute, level=0) => {
        // return `${this.validatorObjectName(attribute.id)} = (resource: Record<string, any>): string => {
        return `const ${this.validatorObjectName(attribute.id)} = (resource: OcdValidatorResource | undefined, resources: ${this.prefix}Resources, displayName=''): OcdValidationResult[] => {
    const results: OcdValidationResult[] = resource ?  [
                ${Object.entries(attribute.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(v.id)).map(([k, a]) => this.attributeToValidatorAssignment(resource, k, a, level+1)).join(',\n                ')}
        ] : []
        return results
    }`
    }

    validatorObjectListElement = (resource, attribute, level=0) => {
        return `${this.validatorObjectElement(resource, attribute)}
    const ${this.validatorObjectListName(attribute.id)} = (resource: OcdValidatorResource[] | undefined, resources: ${this.prefix}Resources, displayName=''): OcdValidationResult[] => {
        const results: OcdValidationResult[] = resource ? resource.reduce((a, c) => [...a as OcdValidationResult[], ...${this.validatorObjectName(attribute.id)}(c, resources, displayName)], [] as OcdValidationResult[]) as OcdValidationResult[] : []
        return results
    }`
    // # ObjectListElement ${this.toCamelCase(attribute.name)} Type ${attribute.type} SubType ${attribute.subtype} Required ${attribute.required} 
    }

    // namespaceName = (resource: string) => `${this.resourceName(resource)}Validator`
    // autoGeneratedNamespaceName = (resource: string) => `${this.autoGeneratedResourceName(resource)}Validator`

    validatorSimpleName = (name) => `${this.toCamelCase(name.replaceAll('.', '_'))}`
    validatorObjectName = (name) => `${this.toCamelCase(name)}Object`
    validatorObjectListName = (name) => `${this.toCamelCase(name)}ObjectList`

    validatorResourceName = (resource) => `${this.resourceName(resource)}`
    validatorResourceGeneratedName = (resource) => `${this.autoGeneratedResourceName(resource)}`
    outputFilename = (resource) => `${this.propertiesFilename(resource)}.ts`

    // resourceName = (resource) => `${this.resourcePropertiesName(resource)}`
    // autoGeneratedResourceName = (resource) => `${super.autoGeneratedResourceName(resource)}`
}

export default OcdValidatorGenerator
// module.exports = { OcdValidatorGenerator }
