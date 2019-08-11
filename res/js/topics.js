const getFromHierarchy = (path, hierarchy, topics) => {
    if(path === "") {
        return {
            name: "Topic",
            subtopics: hierarchy
        };
    }
    if(topics[path].superTopic) {
        let superVal = getFromHierarchy(topics[path].superTopic, hierarchy, topics);
        return superVal? superVal.subtopics[path]: null;
    }
    return hierarchy[path];
};

function createHierarchy(querySnapshot) {
    let topics = {};
    querySnapshot.forEach((doc) => {
        let temp = doc.data();
        if(temp.superTopic)
            temp.superTopic = temp.superTopic.path;
        topics[doc.ref.path] = temp;
    });
    let hierarchy = {};
    const get = (path) => {
        if(topics[path].superTopic) {
            let superVal = get(topics[path].superTopic);
            return superVal? superVal.subtopics[path]: null;
        }
        return hierarchy[path];
    };
    const set = (path) => {
        if(get(path)) return;
        let val = {...topics[path]};
        val.subtopics = {};
        if(!val.superTopic)
            hierarchy[path] = val;
        else {
            let obj = get(val.superTopic);
            if(obj) {
                obj.subtopics[path] = val;
            } else {
                set(val.superTopic);
                set(path)
            }
        }
    };

    for(let path in topics) {
        set(path);
    }
    return [hierarchy, topics];
}