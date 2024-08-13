/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
// TODO: Remove Following
// @ts-nocheck

import fs from 'fs'
import path from 'path'
import { OcdUtils } from '@ocd/core'
import { OcdSchema, OcdSchemaResource } from '../types/OcdSchema'

export class OcdCodeGenerator {
    commonElements = []
    commonIgnoreElements = []
    prefix: string = 'Oci'
    resources: string[] = []
    ignoreAttributes = [...this.commonElements, ...this.commonIgnoreElements]
    resourceFile: string = ''
    resourceAutoGeneratedDefinitionFile: string = ''
    resourceDefinitionFile: string = ''
    resourceObjects = {}
    indentation = ['', '    ', '        ', '            ', '                ']

    constructor(prefix: string='Oci') {
        this.prefix = prefix
        this.resources = []
    }

    generate(resource: string, schema: OcdSchema) {
        this.resources.push(resource)
        this.resourceAutoGeneratedDefinitionFile = this.autoGeneratedContent(resource, schema)
        this.resourceDefinitionFile = this.content(resource, schema)
        // console.info('OcdCodeGenerator: resource Objects', this.resourceObjects)
        this.resourceFile = this.resourcesFileContent(this.resources)
    }

    writeFiles(outputDirectory: string, resource: string, force = false) {
        this.writeGeneratedResourceFiles(outputDirectory, resource, force)
        this.writeResourceFiles(outputDirectory, resource, force)
    }

    writeResourceFiles(outputDirectory: string, resource: string, force = false) {
        const outputFilename = this.outputFilename(resource)
        const resourceDirectory = path.join(outputDirectory, this.resourcesDirectory(resource))
        const resourceFilename = path.join(resourceDirectory, outputFilename)
        if (!fs.existsSync(resourceDirectory)) fs.mkdirSync(resourceDirectory, {recursive: true})
        if (force || !fs.existsSync(resourceFilename)) {
            console.info(`Writting Resource File : ${resourceFilename}`)
            fs.writeFileSync(resourceFilename, this.resourceDefinitionFile)
        } else {
            console.info(`Resource File already exists : ${resourceFilename}`)
        }
    }
    writeGeneratedResourceFiles(outputDirectory: string, resource: string, force = false) {
        const outputFilename = this.outputFilename(resource)
        const resourceDirectory = path.join(outputDirectory, this.resourcesDirectory(resource))
        const generatedDirectory = path.join(outputDirectory, this.resourcesDirectory(resource), this.generatedDirectory(resource))
        const generatedFilename = path.join(generatedDirectory, outputFilename)
        if (!fs.existsSync(resourceDirectory)) fs.mkdirSync(resourceDirectory, {recursive: true})
        if (!fs.existsSync(generatedDirectory)) fs.mkdirSync(generatedDirectory, {recursive: true})
        console.info(`Writting Generated Filename : ${generatedFilename}`)
        fs.writeFileSync(generatedFilename, this.resourceAutoGeneratedDefinitionFile)
    }

    writeFilesSingleMethod(outputDirectory: string, resource: string, force = false) {
        const outputFilename = this.outputFilename(resource)
        const resourceDirectory = path.join(outputDirectory, this.resourcesDirectory(resource))
        const resourceFilename = path.join(resourceDirectory, outputFilename)
        // console.info(`Resource Directory : ${resourceDirectory}`)
        const generatedDirectory = path.join(outputDirectory, this.resourcesDirectory(resource), this.generatedDirectory(resource))
        const generatedFilename = path.join(generatedDirectory, outputFilename)
        // console.info(`Generated Directory : ${generatedDirectory}`)
        if (!fs.existsSync(resourceDirectory)) fs.mkdirSync(resourceDirectory, {recursive: true})
        if (!fs.existsSync(generatedDirectory)) fs.mkdirSync(generatedDirectory, {recursive: true})
        console.info(`Writting Generated Filename : ${generatedFilename}`)
        fs.writeFileSync(generatedFilename, this.resourceAutoGeneratedDefinitionFile)
        if (force || !fs.existsSync(resourceFilename)) {
            console.info(`Writting Resource File : ${resourceFilename}`)
            fs.writeFileSync(resourceFilename, this.resourceDefinitionFile)
        } else {
            console.info(`Resource File already exists : ${resourceFilename}`)
        }
    }

    resourcesFileContent(resources) {
        const contents = `${this.copyright()}
${this.autoGeneratedWarning()}

${resources.sort().map((r) => `export { ${this.resourceName(r)} } from './${this.resourcesDirectory()}/${this.resourceName(r)}'`).join('\n')}
    `
            return contents
    }

    today() {
        const today = new Date()
        return `${today.getDate() < 10 ? '0' : ''}${today.getDate()}/${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}/${today.getFullYear()}`
    }

    now() {
        const today = new Date()
        return `${this.today()} ${today.getHours()}:${today.getMinutes() < 10 ? '0' : ''}${today.getMinutes()}:${today.getSeconds() < 10 ? '0' : ''}${today.getSeconds()}`
    }

    copyright() {
        return `/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/`
    }

    autoGeneratedWarning() {
        return `/*
**
** ======================================================================
** === Auto Generated Code All Edits Will Be Lost During Regeneration ===
** ======================================================================
**
*/`
    }

    generateAutoGeneratedContent = (name: string, schema: OcdSchema): string => {
        const contents = `
${this.copyright()}
${this.autoGeneratedWarning()}

import { ${this.prefix}Resource } from "../../${this.prefix}Resource"

${this.generateAutoGeneratedNamespace(`${this.prefix}name`, schema.attributes, true)}
`
        return contents
    } 

    /*
    ** Rationalised Generation
    ** =======================
    */
    toFunctionName = (name: string) => `${name.charAt(0).toLowerCase()}${name.slice(1)}`
    toSimpleName = (name: string) => `${this.toFunctionName(this.idToName(name, 1))}`
    toObjectName = (name: string) => `${this.toFunctionName(this.idToName(name, 1))}Object`
    toObjectListName = (name: string) => `${this.toFunctionName(this.idToName(name, 1))}ObjectList`

    generateName = (id: string): string => id.split('.').map((n) => n.replaceAll('_', ' ').split(' ').map((e) => OcdUtils.capitaliseFirstCharacter(e)).join('')).join('')
    generateRootName = (name: string): string => `${this.prefix}${this.generateName(name).replace(/\W+/g, '')}`
    generateNestedName = (name: string): string => `${this.generateName(name).replace(/\W+/g, '')}`

    idToName = (id: string, level: number=0): string => level === 0 ? this.generateRootName(id) : this.generateNestedName(id)
    idToNamespaceName = (id: string, level: number=0): string => this.idToName(id, level)
    idToInterfaceName = (id: string, level: number=0): string => this.idToName(id, level)
    idToClassName = (id: string, level: number=0): string => `${this.idToName(id, level)}Client`
    idToNamespaceHierarchy = (id: string, level: number=0): string => id.split('.').map((i) => this.idToNamespaceName(i, level)).join('.')

    generateRootInterfaceReference = (id: string): string => `${this.prefix}${this.generateRootName(id)}`
    generateNestedInterfaceReference = (id: string): string => `${this.generateNestedName(id)}.${this.generateNestedName(id)}`
    generateInterfaceReference = (id: string, level: number=0): string => level === 0 ? this.generateRootInterfaceReference(id) : this.generateNestedInterfaceReference(id)

    generateRootNewFunctionCall = (id: string): string => `new${this.prefix}${this.generateRootName(id)}()`
    generateNestedNewFunctionCall = (id: string): string => `${this.generateNestedName(id)}.new${this.generateNestedName(id)}()`
    generateNewFunctionCall = (id: string, level: number=0): string => level === 0 ? this.generateRootNewFunctionCall(id) : this.generateNestedNewFunctionCall(id)
    generateHierarchicalNewFunctionCall = (id: string): string => `${this.idToNamespaceHierarchy(id, 1)}.new${this.generateNestedName(id.split('.').at(-1))}`

    generateRootNewFunction = (id: string): string => `new${this.generateRootName(id)}`
    generateNestedNewFunction = (id: string): string => `new${this.generateNestedName(id)}`
    generateNewFunction = (id: string, level: number=0): string => level === 0 ? this.generateRootNewFunction(id) : this.generateNestedNewFunction(id)

    generateNamespaceReference = (id: string, rootId: string, level: number=0): string => `export interface ${this.idToInterfaceName(id.split('.').at(-1), level)} extends AutoGenerated.${this.idToInterfaceName(rootId)}.${this.idToNamespaceHierarchy(id, level)}.${this.idToInterfaceName(id.split('.').at(-1), level)}{}`

    generateModelHierarchyReference = (resource: string, id: string, level: number=0): string => `Model.${this.idToNamespaceName(resource)}.${this.idToNamespaceHierarchy(id, 1)}.${this.idToInterfaceName(id.split('.').at(-1), 1)}`
    /*
    ** =======================
    */

    outputFilename = (resource: string) => ''
    content = (resource: string, schema: OcdSchema) => ''
    autoGeneratedContent = (resource: string, schema: OcdSchema) => ''

    configsDirectory = () => 'configs'
    proxiesDirectory = () => 'proxies'
    generatedDirectory = () => 'generated'
    resourcesDirectory = () => 'resources'

    // Model
    modelElementName = (name: string) => `${this.toCamelCase(name.replaceAll('.', '_'))}`

    // Common
    resourceCommonName = (resource: string) => {return `${this.prefix}${this.toTitleCase(resource.split('_').join(' ')).split(' ').join('')}`}
    resourceName = (resource: string) => {return `${this.prefix}${this.toTitleCase(resource.split('_').join(' ')).split(' ').join('')}`}
    resourceFilename = (resource: string) => `${this.resourceName(resource)}`
    autoGeneratedResourceName = (resource: string) => {return `${this.prefix}${this.toTitleCase(resource.split('_').join(' ')).split(' ').join('')}`}

    interfaceName = (resource: string) => this.resourceName(resource)
    namespaceName = (resource: string) => this.resourceName(resource)
    className = (resource: string) => `${this.resourceName(resource)}Client`
    autoGeneratedInterfaceName = (resource: string) => this.autoGeneratedResourceName(resource)
    autoGeneratedNamespaceName = (resource: string) => this.autoGeneratedResourceName(resource)
    autoGeneratedClassName = (resource: string) => `${this.autoGeneratedResourceName(resource)}Client`
    namespaceFunctionName = (name: string) => `new${this.interfaceName(name)}`
    configNamespace = (resource: string) => `${this.resourceName(resource)}Configs`
    proxyNamespace = (resource: string) => `${this.resourceName(resource)}Proxy`
    cssClassName = (resource: string) => `${OcdUtils.toCssClassName(this.prefix, resource)}`

    // Model
    modelFilename = (resource: string) => this.resourceFilename(resource)

    // Properties   
    propertiesFilename = (resource: string) => this.resourceFilename(resource)

    // Terraform   
    terraformFilename = (resource: string) => this.resourceFilename(resource)

    // Markdown   
    markdownFilename = (resource: string) => this.resourceFilename(resource)

 
    toTitleCase = (str: string) => str.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();}).replaceAll('-', '_').replace(/\W+/g, ' ')
    toCamelCase = (str: string) => `${this.toTitleCase(str.split('_').join(' ')).split(' ').map((e, i) => i === 0 ? e.toLowerCase() : e).join('')}`
    capitaliseFirstCharacter = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

    getSchemaObjects = (schema: OcdSchema | OcdSchemaResource) => Object.values(schema.attributes).filter(f => f.attributes).reduce((a, c) => [...a, c, ...this.getSchemaObjects(c)], []).reduce((a, c) => [...a, ...a.find((o) => o.id === c.id) ? [] : [c]], [])
    getSchemaAttributes = (schema: OcdSchema | OcdSchemaResource) => Object.values(schema.attributes).reduce((a, c) => [...a, c, ...c.attributes ? this.getSchemaAttributes(c) : []], []).reduce((a, c) => [...a, ...a.find((o) => o.id === c.id) ? [] : [c]], [])
}

export default OcdCodeGenerator
module.exports = { OcdCodeGenerator }
