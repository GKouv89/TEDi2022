import React, { useState, useEffect } from 'react'
import axios from 'axios'

import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();

export default function MultiAutocomplete(props){
    const [values, setValues] = useState([])
    const [options, setOptions] = useState(null)
   
    useEffect(() => {
        async function fetchCategories(){
            axios.get('http://localhost:8000/auctions/categories/')
                .then((response) => {
                    let opts = []
                    // response.data.results.forEach(category => opts.push({ label: category.name }))
                    response.data.forEach(category => opts.push({ label: category.name }))
                    setOptions(opts)
                })
        }
        fetchCategories()
    }, []);

    let cleanedUpValues = []
    return (
        <Autocomplete 
            value={values}
            onChange={(e, newValue) => {
                if(newValue[newValue.length - 1]){
                    if(typeof newValue[newValue.length - 1] == 'string'){
                        newValue[newValue.length - 1] = { label: newValue[newValue.length - 1]}
                    }
                    setValues(newValue)
                    cleanedUpValues = []
                    newValue.forEach((element) => cleanedUpValues.push(element.label.replace('Add \"', '').replace('\"', '')))
                    props.setFieldValue('categories', cleanedUpValues)    
                }else{ // For some reason, when deleting a tag (pressing the pill's X button), the last element becomes invalid (probably a delay in updating the length)
                    setValues(newValue)
                    cleanedUpValues = []
                    newValue.forEach((element) => cleanedUpValues.push(element.label.replace('Add \"', '').replace('\"', '')))
                    props.setFieldValue('categories', cleanedUpValues)    
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