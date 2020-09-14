import React, { createContext, useContext } from 'react';

const assignmentState= createContext({"notReleased":0,"released":1,"scoring":2,"done":3});

export function useAssignmentState(){
    return useContext(assignmentState);
}