/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export class attestationComment{
    private name: string = "";
    private version: string = "";
    private date: string = "";

    /**
     * Sets the product name
     * @param name The new name
     */
    public addName(name: string){
        this.name = name;
    }

    /**
     * Sets the product version
     * @param version The new version
     */
    public addVersion(version: string){
        this.version = version;
    }

    /**
     * Sets the date
     * @param date The product date
     */
    public addDate(date: string){
        this.date = date;
    }

    /**
     * Gets the name
     * @returns The name
     */
    public getName(){
        return this.name;
    }

    /**
     * Gets the version
     * @returns The version
     */
    public getVersion(){
        return this.version;
    }

    /**
     * Gets the product date
     * @returns The product date
     */
    public getDate(){
        return this.date;
    }

    /**
     * Checks if the row is complete
     * @returns whether the comment row is adequately filled
     */
    public isFilled(){
        return (this.name !== "" && this.date !== "");
    }

}