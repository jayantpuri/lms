const chapterIdPage = ({params}: {params: {courseId: string, chapterId: string}}) => {
    return ( 
        <div>
            <h1>Chapter {params.chapterId}</h1>
        </div>
     );
}
 
export default chapterIdPage;