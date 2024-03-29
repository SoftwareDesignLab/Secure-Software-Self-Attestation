import os
import shutil
import tempfile

# The string to append
append_string = """/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
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
"""
copy_check = "/**\n * Copyright"

# The directory to start from
start_dir = "../../web_app"

for dirpath, dirnames, filenames in os.walk(start_dir):
    # Skip any directory named "node_modules"
    if 'node_modules' in dirnames:
        dirnames.remove('node_modules')

    for filename in filenames:
        if filename.endswith(".ts") or filename.endswith(".css"):
            filepath = os.path.join(dirpath, filename)

            # Check if the file starts with the copyright
            with open(filepath, 'r') as original:
                if original.read(len(copy_check)) == copy_check:
                    original.close()
                    continue

            # Create a temporary file and open it for writing
            with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp:
                # Write the string to append
                temp.write(append_string)

                # Copy the contents of the original file into the temporary file
                with open(filepath, 'r') as original:
                    shutil.copyfileobj(original, temp)

            # Replace the original file with the temporary file
            shutil.move(temp.name, filepath)