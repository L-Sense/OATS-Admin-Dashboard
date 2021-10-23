import React from "react";
import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { authenticationService } from "../services/authenticationService";

function DefaultLayout (){
    const history = useHistory()
    useEffect(()=>{
		authenticationService.authorize()
		.catch( res => {
            history.push('/login')
		});
	}, [])
    
    return(
    <div/>
    )
};

export default DefaultLayout;