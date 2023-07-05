export class attestationComment{
    private name: string = "";
    private version: string = "";
    private date: string = "";

    constructor(){

    }
    public addName(name: string){
        this.name = name;
    }
    public addVersion(version: string){
        this.version = version;
    }
    public addDate(date: string){
        this.date = date;
    }

    public getName(){
        return this.name;
    }
    public getVersion(){
        return this.version;
    }
    public getDate(){
        return this.date;
    }

    public isFilled(){
        return (this.name !== "" && this.date !== "");
    }

}