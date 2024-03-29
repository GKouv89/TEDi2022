import React, { useState, useEffect } from 'react'
import axios from 'axios'

import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();

export default function MultiAutocomplete(props){
    console.log(props.value)
    const [values, setValues] = useState(props.value ?  props.value : [])
    const [options, setOptions] = useState(null)
   
    useEffect(() => {
        async function fetchCategories(){
            axios.get('https://localhost:8000/auctions/categories/')
                .then((response) => {
                    let opts = []
                    // response.data.results.forEach(category => opts.push({ label: category.name }))
                    response.data.forEach(category => opts.push({ label: category.name }))
                    setOptions(opts)
                })
        }
        fetchCategories()
        console.log(values)
        if(values!=[]) {
            setValues(values.map((i) => {
                return { label: i}
            }))
        }

    }, []);

    useEffect(() => {
        if( values) {
            props.setFieldValue(values)
            console.log(values)
        }
    }, [values])

    let cleanedUpValues = []
    return (
        <Autocomplete 
            value={values}
            onChange={(e, newValue) => {
                console.log(newValue)
                if(newValue[newValue.length - 1]){
                    if(typeof newValue[newValue.length - 1] == 'string'){
                        newValue[newValue.length - 1] = { label: newValue[newValue.length - 1]}
                    }
                    setValues(newValue)
                    cleanedUpValues = []
                    newValue.forEach((element) => cleanedUpValues.push(element.label.replace('Add \"', '').replace('\"', '')))
                    console.log(cleanedUpValues)
                    props.setFieldValue('categories', cleanedUpValues)    
                }else{ // For some reason, when deleting a tag (pressing the pill's X button), the last element becomes invalid (probably a delay in updating the length)
                    setValues(newValue)
                    cleanedUpValues = []
                    newValue.forEach((element) => cleanedUpValues.push(element.label.replace('Add \"', '').replace('\"', '')))
                    props.setFieldValue('categories', cleanedUpValues)  
                    console.log(cleanedUpValues)

                }
            }}
            multiple
            disablePortal
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            getOptionLabel={(option) => {
                if(option.label){
                    return option.label.replace('Add \"', '').replace('\"', '');
                }else{
                    return option
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);        
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.label);
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    label: `Add "${inputValue}"`,
                  });
                }
                return filtered;
              }}
            id="combo-box-demo"
            options={options}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Κατηγορία..." />}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
        />
    )
}