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

import { BehaviorSubject } from 'rxjs';

export class Prop {
    #class: BehaviorSubject<string>;
    #name: BehaviorSubject<string>;
    #value: BehaviorSubject<string>;

    constructor(prop: any) {
        this.class = prop.class;
        this.name = prop.name;
        this.value = prop.value;
    }

    get class(): string { return this.#class.getValue(); }
    get name(): string { return this.#name.getValue(); }
    get value(): string { return this.#value.getValue(); }
    get observableClass(): BehaviorSubject<string> { return this.#class; }
    get observableName(): BehaviorSubject<string> { return this.#name; }
    get observableValue(): BehaviorSubject<string> { return this.#value; }
    set class(newClass: string) { this.#class.next(newClass);}
    set name(name: string) { this.#name.next(name); }
    set value(value: string) { this.#value.next(value); }
}