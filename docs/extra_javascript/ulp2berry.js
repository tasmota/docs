var ulp_S_file, ulp_map_file, ulp_binary_length, ulp_build_target;

function parseMapFile(){
    var type = "FSM";
    var symbols = "";
    for(line of ulp_map_file){
        if(line.includes("PROVIDE (ulp")){
            let el = line.split("PROVIDE")[1];
            let suffix = el.replace(")","").split("0x")[1];
            let address = (parseInt(suffix,16) - 0x50000000)/4;
            // console.log(el,suffix,address);
            symbols += "#" + el + " -> ULP.get_mem("+address+") \n";
        }
        if(line.includes("ulp_riscv_run")){
            type = "RISCV";
        }
    }
    if(symbols.length != 0){
        return "# ULP type: "+type+"\n# Build target: "+ulp_build_target+"\n\n"+symbols;
    }
    return ""
}

function parseBinSFile(){
    var binary = [];
    var words;
    for(line of ulp_S_file){
        if(line.startsWith(".byte")){
            tokens = line.split(" ");
            for(token of tokens){
                if(token.startsWith("0x")){
                    binary.push(parseInt(token.substring(2),16));
                }
            }
        }
        if(line.startsWith(".word")){
            words = parseInt((line.split(" ")[1]))
        }
    }
    if(binary.length == words){
        ulp_binary_length = words;
        var _b64 = "";
        for(b of binary){
            _b64 += String.fromCharCode(b);
        }
        return btoa(_b64);
    }
}

function checkULPSDKConfig(file){
    for(line of file){
        let tokens = line.split("=");
        if(tokens[0] == "CONFIG_IDF_TARGET"){
            ulp_build_target = tokens[1];
        }
    }
}

function parseULPFiles(){
    let map_string = parseMapFile();
    let binary64 = parseBinSFile();
    var output =  map_string + "\n";
    output += "# You can paste the following snippet to the berry console: \n";
    output += "# Length of binary in bytes: " + ulp_binary_length + "\n";
    output +="import ULP \n"
    output += "ULP.wake_period(0,1000 * 1000) # timer register 0 - every 1000 millisecs\n";
    output += "c = bytes().fromb64(\""+binary64+"\") \n";
    output += "ULP.load(c) \n";
    output += "ULP.run() \n";
    console.log(output);
    document.getElementById("ulp_output").nextElementSibling.firstChild.childNodes[2].firstChild.innerText = output;
}

function checkULPBuildFiles(){
    if(ulp_S_file && ulp_map_file){
        // console.log(ulp_S_file,ulp_map_file);
        parseULPFiles();
    }
}

function processULPFiles(){
    f_list = document.getElementById("ulp_files").files;
    // console.log(f_list);
    for(f of f_list){
        let reader = new FileReader();
        if(f.name.endsWith(".bin.S")){
            console.log(f);
            reader.addEventListener("load", () => {
                ulp_S_file = reader.result.split(/\r\n|\n/);
                console.log(ulp_S_file);
                checkULPBuildFiles();
        }, false);
        }
        else if(f.name.endsWith(".map")){
            if(f.name.includes("bootloader") || f.webkitRelativePath.includes("esp-idf")){
                continue;
            }
            console.log(f);
            reader.addEventListener("load", () => {
                ulp_map_file = reader.result.split(/\r\n|\n/);
                console.log(ulp_map_file);
                checkULPBuildFiles();
        }, false);
        }
        else if(f.name == "sdkconfig"){
            console.log(f);
            reader.addEventListener("load", () => {
                file = reader.result.split(/\r\n|\n/);
                checkULPSDKConfig(file);
        }, false);
        }
        else {
            continue;
        }
        reader.readAsBinaryString(f);
    }
}
