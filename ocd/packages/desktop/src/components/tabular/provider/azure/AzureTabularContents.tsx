/*
** Copyright (c) 2020, 2024, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import { AzureResource } from "@ocd/model"
import { AzureTabularContentsProps, AzureTabularHeaderProps, AzureTabularResourceProps, AzureTabularRowProps } from "../../../../types/ReactComponentProperties"
import { useContext, useState } from "react"
import { OcdUtils } from "@ocd/core"
import { ConsoleConfigContext } from "../../../../pages/OcdConsole"

export const AzureDefault = ({ ocdDocument, azureResources, selected }: AzureTabularResourceProps): JSX.Element => {
    console.debug('AzureTabularContents: AzureDefault')
    return (
        <div id='ocd_resource_grid' className='table ocd-tabular-content'>
            <div className='thead ocd-tabular-list-header'><div className='tr'><div className='th'>{azureResources[selected].length}</div><div className='th'>Name</div><div className='th'>Compartment</div></div></div>
            <div className='tbody ocd-tabular-list-body'>
                {azureResources[selected].map((r: AzureResource, i: number) => {
                    return <div className='tr' key={`tabular-${r.id}`}><div className='td'>{i + 1}</div><div className='td'>{r.displayName}</div><div className='td'>{ocdDocument.getResource(r.compartmentId) ? ocdDocument.getResource(r.compartmentId).displayName : ''}</div></div>
                })}
            </div>
        </div>
    )
}

export const OcdTabularContents = ({ ocdDocument, azureResources, selected, columnTitles, resourceElements }: AzureTabularContentsProps): JSX.Element => {
    const {ocdConsoleConfig, setOcdConsoleConfig} = useContext(ConsoleConfigContext)
    const [displayColumns, setDisplayColumns] = useState(ocdConsoleConfig.config.displayColumns ? ocdConsoleConfig.config.displayColumns[selected] ? ocdConsoleConfig.config.displayColumns[selected] : columnTitles : columnTitles)
    const [sortColumn, setSortColumn] = useState('')
    const [sortAscending, setSortAscending] = useState(true)
    const onSortClick = (element: string) => {
        const sortFn = (a: Record<string, any>, b: Record<string, any>) => {console.debug('Sort Column:', sortColumn, a, b); return a[sortColumn].localeCompare(b[sortColumn])}
        console.debug('>>>>> OcdTabularContents: Sort Click', element, sortFn)
        setSortColumn(element)
        setSortAscending(!sortAscending)
    }
    const sortFunction = (a: Record<string, any>, b: Record<string, any>): number => {
        let result = 0
        if (!sortColumn || sortColumn === '') result = 0
        else if (Array.isArray(a[sortColumn])) result = a[sortColumn].join(',').localeCompare(b[sortColumn].join(','))
        else if (isElementId(sortColumn)) result = getReferenceDisplayName(a[sortColumn]).localeCompare(getReferenceDisplayName(b[sortColumn]))
        else if (isElementIdList(sortColumn)) result = getReferenceListDisplayNames(a[sortColumn]).localeCompare(getReferenceDisplayName(b[sortColumn]))
        else result = String(a[sortColumn]).localeCompare(String(b[sortColumn]))
        // Check Ascending or Descending
        result = sortAscending ? result : result * -1
        return result
    }
    const getReferenceDisplayName = (id: string) => {
        const resource = ocdDocument.getResource(id)
        return resource ? resource.displayName : 'Unknown'
    }
    const getReferenceListDisplayNames = (ids: string[]) => {
        return ids ? ids.map((id) => getReferenceDisplayName(id)).join(', ') : ''
    }
    const isElementId = (name: string) => name ? name.endsWith('Id') : false
    const isElementIdList = (name: string) => name ? name.endsWith('Ids') : false
    console.debug('OcdTabularContents: Selected', selected)
    return (
        <div id='ocd_resource_grid' className='table ocd-tabular-content'>
            <div className='thead ocd-tabular-list-header'>
                <OcdTabularHeader 
                    columnTitles={columnTitles}
                    azureResources={azureResources}
                    resourceElements={resourceElements}
                    selected={selected}
                    sortColumn={sortColumn}
                    sortAscending={sortAscending}
                    onSortClick={onSortClick}
                    displayColumns={displayColumns}
                    setDisplayColumns={setDisplayColumns}
                    key={`${selected}-tabular-header-row`}
                />
            </div>
            <div className='tbody ocd-tabular-list-body'>
                {azureResources[selected].sort(sortFunction).map((r: AzureResource, i: number) => {
                    return <OcdTabularRow 
                        ocdDocument={ocdDocument}
                        azureResources={azureResources}
                        selected={selected}
                        index={i}
                        resource={r}
                        // resourceElements={resourceElements}
                        resourceElements={displayColumns.map((c: string) => resourceElements[columnTitles.indexOf(c)])}
                        key={`${selected}-tabular-${r.id}`}
                    />
                })}
            </div>
        </div>
    )
}

export const OcdTabularHeader = ({columnTitles, azureResources, resourceElements, selected, sortColumn, sortAscending, onSortClick, displayColumns, setDisplayColumns}: AzureTabularHeaderProps): JSX.Element => {
    const {ocdConsoleConfig, setOcdConsoleConfig} = useContext(ConsoleConfigContext)
    const [menuVisible, setMenuVisible] = useState(false)
    const onToggleMenuClick = () => {setMenuVisible(!menuVisible && columnTitles.length > 0)}
    const ascClasses = 'ocd-sort-background-icon sort-ascending'
    const dscClasses = 'ocd-sort-background-icon sort-descending'
    const onToggleColumnClick = (e: React.MouseEvent<HTMLLabelElement>) => {e.stopPropagation()}
    const onToggleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        // const newDisplayColumns = e.target.checked ? [...displayColumns, e.target.id] : displayColumns.filter((c) => c !== e.target.id)
        const newDisplayColumns = e.target.checked ? columnTitles.filter((t) => [...displayColumns, e.target.id].includes(t)) : displayColumns.filter((c) => c !== e.target.id)
        console.debug('OcdTabularContents:', e)
        if (!ocdConsoleConfig.config.displayColumns) ocdConsoleConfig.config.displayColumns = {}
        ocdConsoleConfig.config.displayColumns[selected] = newDisplayColumns
        setDisplayColumns(newDisplayColumns)
        // setOcdConsoleConfig(OcdConsoleConfig.clone(ocdConsoleConfig))
    }
    console.debug('OcdTabularHeader: Selected', selected, displayColumns)
    return (
        <div className='tr' key={`${selected}-tabular-header-row`}>
            <div className='th'>{azureResources[selected].length}</div>
            <div className={`th ocd-sortable-column ${sortColumn === 'displayName' ? sortAscending ? ascClasses : dscClasses : ''}`} onClick={() => onSortClick('displayName')} key={`${selected}-tabular-header-row-displayName`}>Name</div>
            <div className={`th ocd-sortable-column ${sortColumn === 'compartmentId' ? sortAscending ? ascClasses : dscClasses : ''}`} onClick={() => onSortClick('compartmentId')} key={`${selected}-tabular-header-row-compartmentId`}>Compartment</div>
            {displayColumns.map((title: string, i: number) => {return <div className={`th ocd-sortable-column ${sortColumn === resourceElements[i] ? sortAscending ? ascClasses : dscClasses : ''}`} onClick={() => onSortClick(resourceElements[i])} key={`${selected}-tabular-header-row-${OcdUtils.toUnderscoreCase(title)}`}>{title}</div>})}
            <div className={`th-menu ocd-console-three-dot-menu-icon`}>
                <div className='ocd-console-toolbar-dropdown ocd-console-toolbar-dropdown-theme'>
                    <ul>
                        <li className='ocd-console-toolbar-dropdown-item' onClick={onToggleMenuClick}>
                            <div className='three-dot-menu ocd-console-three-dot-menu-icon'></div>
                            {menuVisible && <ul className={'show slide-down slide-right'}>
                                {/* <li className='ocd-dropdown-menu-item ocd-mouseover-highlight'><label onClick={onToggleColumnClick}><input type="checkbox" onChange={onToggleColumnChange}/>Name</label></li> */}
                                {columnTitles.map((title: string, i: number) => {return <li className='ocd-dropdown-menu-item ocd-mouseover-highlight' key={`${selected}-${title.split(' ').join('')}`}><label onClick={onToggleColumnClick}><input id={title} type="checkbox" onChange={onToggleColumnChange} checked={displayColumns.includes(title)}/>{title}</label></li>})}
                            </ul>}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export const OcdTabularRow = ({ocdDocument, azureResources, index, resource, resourceElements, selected}: AzureTabularRowProps): JSX.Element => {
    const getReferenceDisplayName = (id: string) => {
        const resource = ocdDocument.getResource(id)
        return resource ? resource.displayName : 'Unknown'
    }
    const getReferenceListDisplayNames = (ids: string[]) => {
        return ids ? ids.map((id) => getReferenceDisplayName(id)).join(', ') : ''
    }
    const isElementId = (name: string) => name ? name.endsWith('Id') : false
    const isElementIdList = (name: string) => name ? name.endsWith('Ids') : false
    console.debug('OcdTabularRow: Selected', selected)
    return (
        <div className='tr' key={`tabular-${resource.id}`}>
            <div className='td'>{index + 1}</div><div className='td'>{resource.displayName}</div>
            <div className='td'>{getReferenceDisplayName(resource.compartmentId)}</div>
            {/* <div className='td'>{ocdDocument.getResource(r.compartmentId) ? ocdDocument.getResource(r.compartmentId).displayName : ''}</div> */}
            {resourceElements.map((element) => {return <div className='td' key={`tabular-${resource.id}-${element}`}>{isElementId(element) ? getReferenceDisplayName(resource[element]) : isElementIdList(element) ? getReferenceListDisplayNames(resource[element]) : String(resource[element])}</div>})}
            <div className="td"></div>
        </div>
    )
}
