import React from 'react';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';

export default function InvalidURL() {
    const isLoggedIn = authenticationService.getToken()
    if(isLoggedIn==null){
        return (
            <Redirect to="/login"/>
        )
    }

    return(
        <div className='invalidURL'>This URL doesn't exist.</div>
    )
}