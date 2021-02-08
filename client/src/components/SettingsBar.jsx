import React from 'react'

import { toolState } from '../store/'

import '../styles/toolbar.scss'

function SettingsBar() {
    return (
        <div className="settings-bar">
            {/* Толщина линии */}
            <label htmlFor="line-width">Толщина линии</label>
            <input 
                onChange={(e) => toolState.setLineWidth(e.target.value)}
                id="line-width" 
                type="number" 
                style={{margin: '0 10px'}} 
                defaultValue={1} 
                min={1} 
                max={50} 
            />
            {/* Цвет обводки */}
            <label htmlFor="stroke-color">Цвет обводки</label>
            <input 
                id="stroke-color"
                onChange={(e) => toolState.setStrokeColor(e.target.value)}
                type="color"
                style={{margin: '0 10px'}} 
            />
        </div>
    )
}

export default SettingsBar
