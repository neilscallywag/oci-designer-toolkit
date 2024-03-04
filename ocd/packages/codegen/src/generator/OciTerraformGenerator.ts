/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
// TODO: Remove Following
// @ts-nocheck

import { OcdCodeGenerator } from './OcdCodeGenerator.js'
import { OcdUtils } from '@ocd/core'
import { terraformMetadataOverrides } from './data/OcdMetadataOverrides.js'

export class OciTerraformGenerator extends OcdCodeGenerator {
    constructor () {
        super()
        this.ignoreAttributes = [...this.commonElements, ...this.commonIgnoreElements]
    }

    /*
    ** Content for the top level file. This will only be created if it does not exists.
    */
   content = (resource: string, schema) => {
    const schemaObjects = this.getSchemaObjects(schema)
    const contents = `${this.copyright()}

import * as AutoGenerated from "./${this.generatedDirectory()}/${this.interfaceName(resource)}"

export class ${this.resourceName(resource)} extends AutoGenerated.${this.autoGeneratedResourceName(resource)} {}

export default ${this.resourceName(resource)}
`
    return contents
   }

    /*
    ** Content for the auto generated file this will be written on each execution.
    */
    autoGeneratedContent = (resource: string, schema) => {
        const schemaObjects = this.getSchemaObjects(schema)
        const schemaAttributes = this.getSchemaAttributes(schema)
        const cacheLookupAttributes = schemaAttributes.filter((a) => a.cacheLookup)
        const contents = `${this.copyright()}
${this.autoGeneratedWarning()}
/* eslint-disable @typescript-eslint/no-unused-vars */

import { OciTerraformResource } from '../../OciTerraformResource'
import { OciModelResources as Model } from '@ocd/model'

export class ${this.autoGeneratedResourceName(resource)} extends OciTerraformResource {
    resource: Model.${this.interfaceName(resource)}
    constructor(resource: Model.${this.interfaceName(resource)}, idTFResourceMap: Record<string, string> = {}, isHomeRegion: boolean = false, isIgnoreCompartmentId: boolean = false) {
        super(idTFResourceMap, isHomeRegion, isIgnoreCompartmentId)
        this.resource = resource
        this.terraformResourceName = resource.terraformResourceName
    }

    /*
    ** Generate Reference Lookups
    */
    generateReference(resource: Model.${this.interfaceName(resource)}) {
        return [${cacheLookupAttributes.map((a) => this.terraformReferenceDataFunctionName(a.lookupResource)).join(',')}].join('')
    }

    /*
    ** Generate Terraform Resource / Data Statement(s)
    */
    generate(resource: Model.${this.interfaceName(resource)} | undefined) {
        resource = resource ? resource : this.resource
        if (resource.locked) {
            return this.generateData(resource)
        } else {
            return this.generateResource(resource)
        }
    }

    generateResource(resource: Model.${this.interfaceName(resource)}) {
        const content = \`\${this.generateReference(resource)}
# ------ Create ${OcdUtils.toTitle(resource)}
resource "${schema.tf_resource}" "\${resource.terraformResourceName}" {
    \${this.commonAssignments(resource)}
    ${Object.entries(schema.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(k)).map(([k, a]) => this.attributeToTerraformAssignment(resource, k, a)).join('\n    ')}
}

locals {
    \${resource.terraformResourceName}_id = ${schema.tf_resource}.\${resource.terraformResourceName}.id
    \${this.generateAdditionalResourceLocals(resource)}
}
\`
    return content
    }

    generateData(resource: Model.${this.interfaceName(resource)}) {
        const content = \`
# ------ Read ${OcdUtils.toTitle(resource)}
data "${schema.tf_resource}s" "\${resource.terraformResourceName}" {
    # Required
    compartment_id = "\${resource.compartmentId}"
    filter {
        name = "id"
        values = ["\${resource.id}"]
    }
}

locals {
    \${resource.terraformResourceName}_id = "\${resource.id}"
    \${resource.terraformResourceName}_ocid = "\${resource.id}"
}
\`
    return content
    }
    // Complex Elements
    ${schemaObjects.map(i => this.terraformComplextElement(resource, i)).filter(i => i.trim() !== '').join('\n    ')}
    // Simple Elements
    ${schemaAttributes.filter(a => !this.ignoreAttributes.includes(a.name)).map(i => this.terraformSimpleElement(resource, i)).filter(i => i.trim() !== '').join('\n    ')}
    
}

export default ${this.autoGeneratedResourceName(resource)}
`
        return contents
    }

    simpleAttributeAssignmentTest = (resource, name, attribute) => {
        return `this.isPropertyAssignConditionTrue(${attribute.conditional}, ${JSON.stringify(attribute.condition)}, resource) ? this.isGenerateAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}) : false`
    }

    attributeToAssignmentTest = (resource, name, attribute) => {
        if (attribute.type === 'string' && attribute.lookup)                  return `this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource)`
        else if (attribute.type === 'string')                                 return `this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource)`
        else if (attribute.type === 'bool')                                   return `this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource)`
        else if (attribute.type === 'number')                                 return `this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource)`
        else if (attribute.type === 'list' && attribute.subtype === 'string') return `this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource)`
        else if (attribute.type === 'object')                                 return `this.${this.terraformObjectAssignmentTestName(attribute.name)}(resource.${this.modelElementName(attribute.name)})`
        else if (attribute.type === 'object')                                 return `this.${this.terraformObjectAssignmentTestName(attribute.name)}(resource.${this.modelElementName(attribute.name)})`
        else if (attribute.type === 'list' && attribute.subtype === 'object') return `this.${this.terraformObjectListAssignmentTestName(attribute.name)}(resource.${this.modelElementName(attribute.name)})`
        else if (attribute.type === 'list' && attribute.lookup)               return `this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource)`
        else return `false`
    }

    attributeToTerraformAssignment = (resource, name, attribute, level=0) => {
        if (attribute.type === 'string' && attribute.lookup)                  return `\${this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformSimpleName(attribute.name)}(resource${level === 0 ? '' : ', level+1'}) : ''}`
        else if (attribute.type === 'string')                                 return `\${this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformSimpleName(attribute.name)}(resource${level === 0 ? '' : ', level+1'}) : ''}`
        else if (attribute.type === 'bool')                                   return `\${this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformSimpleName(attribute.name)}(resource${level === 0 ? '' : ', level+1'}) : ''}`
        else if (attribute.type === 'number')                                 return `\${this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformSimpleName(attribute.name)}(resource${level === 0 ? '' : ', level+1'}) : ''}`
        else if (attribute.type === 'list' && attribute.subtype === 'string') return `\${this.${this.terraformSimpleAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformSimpleName(attribute.name)}(resource${level === 0 ? '' : ', level+1'}) : ''}`
        else if (attribute.type === 'object')                                 return `\${this.${this.terraformObjectAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformObjectName(attribute.name)}(resource.${this.modelElementName(attribute.name)}${level === 0 ? '' : ', level+1'}) : ''}`
        else if (attribute.type === 'list' && attribute.subtype === 'object') return `\${this.${this.terraformObjectListAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformObjectListName(attribute.name)}(resource.${this.modelElementName(attribute.name)}${level === 0 ? '' : ', level+1'}) : ''}`
        else if (attribute.type === 'list' && attribute.lookup)               return `\${this.${this.terraformObjectAssignmentTestName(attribute.name)}(resource) ? this.${this.terraformSimpleName(attribute.name)}(resource${level === 0 ? '' : ', level+1'}) : ''}`
        else return `# ${this.toCamelCase(name)} Type ${attribute.type} SubType ${attribute.subtype} Required ${attribute.required}`
    }

    terraformSimpleElementType = (resource, name, attribute, level=0, resourceName='common') => {
        const mentadataAttributes = {...terraformMetadataOverrides.common, ...Object.hasOwn(terraformMetadataOverrides, resourceName) ? terraformMetadataOverrides[resourceName] : {}}
        if (Object.hasOwn(mentadataAttributes, name))                         return `this.generateMetadataAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, '${mentadataAttributes[name]}', level)`
        else if (attribute.type === 'string' && attribute.cacheLookup)        return `this.generateCacheAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level, '${attribute.lookupResource}')`
        else if (attribute.type === 'string' && attribute.staticLookup)       return `this.generateTextAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level)`
        else if (attribute.type === 'string' && attribute.lookup)             return `this.generateReferenceAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level${attribute.lookupResourceElement && attribute.lookupResourceElement !== '' ? `, '${attribute.lookupResourceElement}'` : ''})`
        else if (attribute.type === 'string')                                 return `this.generateTextAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level)`
        else if (attribute.type === 'bool')                                   return `this.generateBooleanAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level)`
        else if (attribute.type === 'number')                                 return `this.generateNumberAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level)`
        else if (attribute.type === 'list' && attribute.lookup)               return `this.generateReferenceListAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level)`
        else if (attribute.type === 'list' && attribute.subtype === 'string') return `this.generateStringListAttribute("${name}", resource.${this.toCamelCase(name)}, ${attribute.required}, level)`
        else return `'# ${this.toCamelCase(name)} Type ${attribute.type} Required ${attribute.required}'`
    }

    terraformSimpleElement = (resource, attribute, level=0) => {
        const simpleTypes = ['string', 'bool', 'number']
        const groupTypes = ['list', 'set']
        if (simpleTypes.includes(attribute.type) || (groupTypes.includes(attribute.type) && simpleTypes.includes(attribute.subtype))) {
            return `// ${OcdUtils.toResourceTypeName(attribute.name)} (${this.terraformSimpleName(attribute.name)})
    ${this.terraformSimpleName(attribute.name)} = (resource: Record<string, any>, level=0): string => {return ${this.terraformSimpleElementType(resource, attribute.name, attribute)}}
    ${this.terraformSimpleAssignmentTestName(attribute.name)} = (resource: Record<string, any>): boolean => {return ${this.simpleAttributeAssignmentTest(resource, attribute.name, attribute)}}
    `
            // return `${this.terraformSimpleName(attribute.name)} = (resource: Model.${this.interfaceName(resource)}): string => {return ${this.terraformSimpleElementType(resource, attribute.name, attribute)}}`
        } else return ''
    }

    terraformComplextElement = (resource, attribute) => {
        if (attribute.type === 'object') return this.terraformObjectElement(resource, attribute)
        else if (attribute.type === 'list' && attribute.subtype === 'object') return this.terraformObjectListElement(resource, attribute)
        else return ``
    }

    terraformObjectElement = (resource, attribute, level=0) => {
        // return `${this.terraformObjectName(attribute.name)} = (resource: Record<string, any>): string => {
        return `// ${OcdUtils.toResourceTypeName(attribute.name)} (${this.terraformObjectName(attribute.name)})
    ${this.terraformObjectName(attribute.name)} = (resource: Model.${this.interfaceName(resource)}.${this.interfaceName(attribute.name)} | undefined, level=0): string => {
            return resource && this.${this.terraformObjectAssignmentTestName(attribute.name)}(resource) ? \`\${this.indentation[level]}${attribute.name}${attribute.subtype === 'map' ? ' =' : ''} {
    ${Object.entries(attribute.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(k)).map(([k, a]) => this.attributeToTerraformAssignment(resource, k, a, level+1)).join('\n    ')}
    \${this.indentation[level]}}\` : '# ${attribute.name} is not defined. Type: ${attribute.type} SubType: ${attribute.subtype} Required: ${attribute.required}'
    }
    ${this.terraformObjectAssignmentTestName(attribute.name)} = (resource: Record<string, any>): boolean => {
        return ${Object.keys(attribute.attributes).filter((k) => !this.ignoreAttributes.includes(k)).length > 0 ? Object.entries(attribute.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(k)).map(([k, a]) => this.attributeToAssignmentTest(resource, k, a)).join('||\n        ') : 'false'}
    }
    `
    }

    terraformObjectListElement = (resource, attribute, level=0) => {
        return `${this.terraformObjectElement(resource, attribute)}
    // ${OcdUtils.toResourceTypeName(attribute.name)} (${this.terraformObjectListName(attribute.name)})
    ${this.terraformObjectListName(attribute.name)} = (objectList: Model.${this.interfaceName(resource)}.${this.interfaceName(attribute.name)}[] | undefined, level=0): string => {
        return objectList && objectList.length > 0 ? \`\${objectList.map((o: Model.${this.interfaceName(resource)}.${this.interfaceName(attribute.name)}) => this.${this.terraformObjectName(attribute.name)}(o)).join(\`\\n\${this.indentation[level+1]}\`)}\` : '# ${attribute.name} is not defined. Type: ${attribute.type} SubType: ${attribute.subtype} Required: ${attribute.required}'
    }
    ${this.terraformObjectListAssignmentTestName(attribute.name)} = (objectList: Model.${this.interfaceName(resource)}.${this.interfaceName(attribute.name)}[] | undefined): boolean => {
        return objectList && objectList.length > 0 ? objectList.some((o: Model.${this.interfaceName(resource)}.${this.interfaceName(attribute.name)}) => this.${this.terraformObjectAssignmentTestName(attribute.name)}(o)) : false
    }
    `
    // # ObjectListElement ${this.toCamelCase(attribute.name)} Type ${attribute.type} SubType ${attribute.subtype} Required ${attribute.required} 
    }

    terraformSimpleName = (name) => `${this.toCamelCase(name.replaceAll('.', '_'))}`
    terraformObjectName = (name) => `${this.toCamelCase(name)}Object`
    terraformObjectListName = (name) => `${this.toCamelCase(name)}ObjectList`
    terraformSimpleAssignmentTestName = (name) => `isAssign${OcdUtils.toResourceType(name)}`
    terraformObjectAssignmentTestName = (name) => `${this.terraformSimpleAssignmentTestName(name)}Object`
    terraformObjectListAssignmentTestName = (name) => `${this.terraformSimpleAssignmentTestName(name)}ObjectList`
    terraformReferenceDataFunctionName = (lookupResource) => `this.retrieve${this.capitaliseFirstCharacter(lookupResource.slice(0, -1))}Id()`

    outputFilename = (resource: string) => `${this.terraformFilename(resource)}.ts`
}

export default OciTerraformGenerator
module.exports = { OciTerraformGenerator }
