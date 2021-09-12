function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

var extractResponses = function() {
    return $( "table.texte.cadre" )
        .map(function() {
            const attached = $(this).find("td.qcm_examen_question img");
            if (attached.length) {
                attached.removeAttr("height");
                attached.removeAttr("width");
            }
            const explainationAttached = $(this).find("td.qcm_examen_correction img");
            
            const resp=$(this).find("td.qcm_examen_reponses_bonne,td.qcm_examen_reponses").map(
                function(){
                    return {
                        correct: $(this).attr("class")=="qcm_examen_reponses_bonne", 
                        label:$(this).html().replace('<br>', "\n"),
                    };
                }
            ).toArray();

            const question = $(this).find("td.qcm_examen_question").text().replace('<br>', "\n") 
                           + "\n" 
                           + $(this).find("td.qcm_examen_options").text().replace('<br>', "\n")

            return {
                id:                      $(this).find("td.qcm_examen_no").text().replace(/[^\d].*/, ''),
                question:                question,
                explaination:            $(this).find("td.qcm_examen_correction div.commentaires-list").text().replace('<br>', "\n"),
                attachedB64:             attached.length ? getBase64Image(attached.get(0)) : null,
                explainationAttachedB64: explainationAttached.length ? getBase64Image(explainationAttached.get(0)) : null,
                responses:               resp,
            };
        })
        .get()
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === 'report_back') {
        sendResponse(extractResponses());
    }
});


console.log("Extractor is ready")