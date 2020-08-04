const reducer = (state = 'suit Up', action) => {
    switch(action.type) {
        case 'currentComment':
            return {
                ...state, 
                cComment: action.data,
            }
        default:
            return state;
    }
};

export default reducer;