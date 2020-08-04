export const currentComment = (data) => dispatch => {
	dispatch({type : "currentComment" , data : data})
}