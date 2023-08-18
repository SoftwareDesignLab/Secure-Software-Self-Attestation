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
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rollable',
  templateUrl: './rollable.component.html',
  styleUrls: ['./rollable.component.css']
})
export class RollableComponent {
  @Input() description: any;
  @Input() examples: any;
  @Input() references: any;
  @Input() props: any;

  /**
   * 
   * @returns Whether there is a description
   */
  hasDescription(): boolean {
    return this.description !== undefined;
  }

  /**
   * 
   * @returns Whether there are examples in the parts
   */
  hasExamples(): boolean {
    return this.examples !== undefined && this.examples.length > 0;
  }

  /**
   * 
   * @returns Whether there are references in the props
   */
  hasReferences(): boolean {
    return this.references !== undefined && this.references.length > 0;
  }

  hasProperties(): boolean {
    return this.props !== undefined && this.props.length > 0;
  }
}