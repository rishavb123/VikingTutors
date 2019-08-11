const navResults = {}

function onNavReady(querySnapshot, hierarchy, topics) {
    navResults.hierarchy = hierarchy;
    navResults.topics = topics;
}