#!/usr/bin/env python3

import os
import re
import sys
from sys import stdout


def preprocess_file(filename):
    import_regex = re.compile(r'^\s*import\s*"([^"]*)"\s*;\s*$')
    with open(filename) as file_in:
        for line in file_in:
            match = import_regex.match(line)
            if match:
                imported_name = match.group(1)
                absolute_name = os.path.abspath(os.path.join(os.path.dirname(filename),  imported_name))
                stdout.write('import "{}";\n'.format(os.path.abspath(absolute_name)))
            else:
                stdout.write(line)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("USAGE:")
        print("    python3 {} input-file.sol".format(sys.argv[0]))
    preprocess_file(sys.argv[1])
