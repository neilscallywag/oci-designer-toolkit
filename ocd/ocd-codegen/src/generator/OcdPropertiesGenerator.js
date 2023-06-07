/*
** Copyright (c) 2020, 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import fs from 'fs'
import path from 'path'
import { OcdCodeGenerator } from './OcdCodeGenerator.js'

export class OcdPropertiesGenerator extends OcdCodeGenerator {
    constructor () {
        super()
        this.ignoreAttributes = [...this.commonElements, ...this.commonIgnoreElements]
    }

    generate(resource, schema) {
        super.generate(resource, schema)
        this.resourceConfigFile = this.configContent(resource, schema)
    }

    writeFiles(outputDirectory, resource, force = false) {
        super.writeFiles(outputDirectory, resource, force)
        const outputFilename = this.configFilename(resource)
        const configDirectory = path.join(outputDirectory, this.resourcesDirectory(resource), this.configsDirectory(resource))
        const configFilename = path.join(configDirectory, outputFilename)
        // console.info(`Resource Directory : ${configDirectory}`)
        if (!fs.existsSync(configDirectory)) fs.mkdirSync(configDirectory, {recursive: true})
        if (!fs.existsSync(configFilename)) {
            console.info(`Writting Config File : ${configFilename}`)
            fs.writeFileSync(configFilename, this.resourceConfigFile)
        } else {
            console.info(`Config File already exists : ${configFilename}`)
        }
    }

    /*
    ** Content for the top level file. This will only be created if it does not exists.
    */
    content = (resource, schema) => {
        const schemaObjects = this.getSchemaObjects(schema)
        const content = `${this.copyright()}

import OcdDocument from '../../../../OcdDocument'
import { ResourceElementConfig, ResourceProperties } from '../../../OcdPropertyTypes'
import * as AutoGenerated from './${this.generatedDirectory()}/${this.reactResourceName(resource)}'
import { ${this.configNamespace(resource)} } from './${this.configsDirectory()}/${this.reactResourceName(resource)}'

export const ${this.reactResourceName(resource)} = ({ ocdDocument, setOcdDocument, resource }: ResourceProperties): JSX.Element => {
    const configs: ResourceElementConfig[] = ${this.configNamespace(resource)}.configs()
    return (
        <AutoGenerated.${this.reactResourceGeneratedName(resource)} ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} configs={configs} />
    )
}
`
        return content
    }

    /*
    ** Content for the auto generated file this will be written on each execution.
    */
    autoGeneratedContent = (resource, schema) => {
        const schemaObjects = this.getSchemaObjects(schema)
        // console.info('Schema Objects', schemaObjects)
        const content = `${this.copyright()}
/* eslint-disable @typescript-eslint/no-unused-vars */

import { v4 as uuidv4 } from 'uuid'
import OcdDocument from '../../../../../OcdDocument'
import { GeneratedResourceProperties, OcdBooleanProperty, OcdListProperty, OcdLookupProperty, OcdMapProperty, OcdNumberProperty, OcdSetLookupProperty, OcdSetProperty, OcdTextProperty, ResourceProperty} from '../../../../OcdPropertyTypes'
import * as Model  from '../../../../../../model/provider/oci/resources/${this.modelFilename(resource)}'

${schemaObjects.map(i => this.reactComplextElement(resource, i)).filter(i => i.trim() !== '').join('')}

export const ${this.reactResourceGeneratedName(resource)} = ({ ocdDocument, setOcdDocument, resource, configs }: GeneratedResourceProperties): JSX.Element => {
    return (
        <div>
            <details open={true}>
                <summary className='summary-background'>Resource</summary>
                <div className='ocd-resource-properties'>
                    ${Object.entries(schema.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(k)).map(([k, a]) => this.reactAttributeElement(resource, k, a)).join('\n                    ')}
                </div>
            </details>
        </div>
    )
}
`
        return content
    }

    /*
    ** Content of the Properties Config file.
    */

    configContent = (resource, schema) => {
        const schemaObjects = this.getSchemaObjects(schema)
        const content = `${this.copyright()}

import { ResourceElementConfig } from "../../../../OcdPropertyTypes";

export namespace ${this.configNamespace(resource)} {
    export function configs(): ResourceElementConfig[] {return []}
}
`
        return content
    }

    /*
    ** Content for the auto generated resource summary file this will be written on each execution.
    */

    reactAttributeElement = (resource, name, attribute) => {
        // console.info('Name:', name)
        // console.info('>> Resource:', resource)
        // console.info('>> Attribute:', attribute)

        // For Objects need to create local Type
        
        const configFind = `configs.find((c) => c.id === '${attribute.id}')`
        if (attribute.type === 'string' && attribute.lookup)                  return `<OcdLookupProperty     ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'string')                                 return `<OcdTextProperty       ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'bool')                                   return `<OcdBooleanProperty    ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'number')                                 return `<OcdNumberProperty     ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'object')                                 return `<${this.reactObjectName(attribute.name)} ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource['${attribute.key}']} configs={configs} />`
        // else if (attribute.type === 'object')                                 return `<OcdObjectProperty     ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        // else if (attribute.type === 'list' && attribute.subtype === 'object') return `<OcdObjectListProperty ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'list' && attribute.subtype === 'object') return `<${this.reactObjectListName(attribute.name)} ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource['${attribute.key}']} configs={configs} />`
        else if (attribute.type === 'list')                                   return `<OcdListProperty       ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'set')                                    return `<OcdSetProperty        ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'set' && attribute.lookup)                return `<OcdSetLookupProperty  ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
        else if (attribute.type === 'map')                                    return `<OcdMapProperty        ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={resource} config={${configFind}} attribute={${JSON.stringify(attribute)}} />`
    }

    reactComplextElement = (resource, attribute) => {
        if (attribute.type === 'object') return this.reactObjectElement(resource, attribute)
        else if (attribute.type === 'list' && attribute.subtype === 'object') return this.reactObjectListElement(resource, attribute)
        else return ``
    }

    reactObjectElement = (resource, attribute) => {
        return `
export const ${this.reactObjectName(attribute.name)} = ({ ocdDocument, setOcdDocument, resource, configs }: GeneratedResourceProperties): JSX.Element => {
    return (
        <div className='ocd-property-row'>
            <details open={true}>
                <summary className='summary-background'>${attribute.label}</summary>
                <div className='ocd-resource-properties'>
                    ${Object.entries(attribute.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(k)).map(([k, a]) => this.reactAttributeElement(resource, k, a)).join('\n                    ')}
                </div>
            </details>
        </div>
    )
}
`
    }

    reactObjectListElement = (resource, attribute) => {
        // console.info('Object List Attribute', attribute)
        let objectLabel = attribute.label.split(' ').at(-1)
        objectLabel = objectLabel.endsWith('s') ? objectLabel.slice(0, -1) : objectLabel
        return `
export const ${this.reactObjectName(attribute.name)} = ({ ocdDocument, setOcdDocument, resource, configs, onDelete }: GeneratedResourceProperties): JSX.Element => {
    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()
        if (onDelete) onDelete(resource)
    }
    return (
        <div className='ocd-property-row'>
            <details open={true}>
                <summary className='summary-background ocd-summary-row'><div>${objectLabel}</div><div className='delete-property action-button-background action-button-column action-button' onClick={onClick}></div></summary>
                <div className='ocd-resource-properties'>
                    ${Object.entries(attribute.attributes).filter(([k, v]) => !this.ignoreAttributes.includes(k)).map(([k, a]) => this.reactAttributeElement(resource, k, a)).join('\n                    ')}
                </div>
            </details>
        </div>
    )
}
        
export const ${this.reactObjectListName(attribute.name)} = ({ ocdDocument, setOcdDocument, resource, configs }: GeneratedResourceProperties): JSX.Element => {
    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()
        resource.push(Model.${this.namespaceName(resource)}.${this.namespaceFunctionName(attribute.name)}())
        setOcdDocument(OcdDocument.clone(ocdDocument))
    }
    const onDelete = (child: Model.${this.interfaceName(attribute.name)}) => {
        resource.splice(resource.indexOf(child), 1)
        setOcdDocument(OcdDocument.clone(ocdDocument))
    }
    // @ts-ignore 
    resource.forEach((r: Model.${this.interfaceName(attribute.name)}) => {if (!r.key) r.key = uuidv4()})
    return (
        <div className='ocd-property-row'>
            <details open={true}>
                <summary className='summary-background ocd-summary-row'><div>${attribute.label}</div><div className='add-property action-button-background action-button-column action-button' onClick={onClick}></div></summary>
                <div className='ocd-resource-properties'>
                    {resource.map((r: Model.${this.interfaceName(resource)}) => {return <${this.reactObjectName(attribute.name)} ocdDocument={ocdDocument} setOcdDocument={(ocdDocument:OcdDocument) => setOcdDocument(ocdDocument)} resource={r} configs={configs} onDelete={onDelete} key={r.key}/>})}
                </div>
            </details>
        </div>
    )
}`
    }

    reactObjectName = (name) => `${this.resourceName(name)}Object`
    reactObjectListName = (name) => `${this.resourceName(name)}ObjectList`

    reactResourceName = (resource) => this.resourceName(resource)
    reactResourceGeneratedName = (resource) => this.autoGeneratedResourceName(resource)
    outputFilename = (resource) => `${this.propertiesFilename(resource)}.tsx`
    configFilename = (resource) => `${this.propertiesFilename(resource)}.ts`

    // resourceName = (resource) => `${this.resourcePropertiesName(resource)}`
    // autoGeneratedResourceName = (resource) => `${super.autoGeneratedResourceName(resource)}`
}

export default OcdPropertiesGenerator
