interface coursePageParams{
    params: {courseId : string}
}
const CoursePage = ({params}: coursePageParams) => {
    return ( 
        <div>
            <h1>Course {params.courseId}</h1>
        </div>
     );
}
 
export default CoursePage;