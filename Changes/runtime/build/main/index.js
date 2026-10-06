
import { createRequire as __createRequire__ } from 'module';
const require = __createRequire__(import.meta.url);


// main/index.ts
import * as fs3 from "fs";
import * as path4 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { app as app3, BrowserWindow as BrowserWindow3, Menu, logger as logger7, initDevToolsButtonState } from "@glaze/core/backend";

// main/handlers/index.ts
import * as path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// main/handlers/app.ts
import { logger } from "@glaze/core/backend";
var appHandlers = {
  // Example: Get app information
  getInfo: async () => {
    logger.info("app", "App info requested");
    return {
      name: "My Glaze App",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "production"
    };
  }
  // TODO: Add your app handlers here
  // Example:
  // myMethod: async (params: { arg1: string }) => {
  //   return { result: 'success' };
  // }
};

// main/handlers/watches.ts
import { ipcMain as ipcMain3 } from "@glaze/core/backend";

// main/services/watch-service.ts
import * as crypto from "crypto";

// node_modules/jsonpath-plus/dist/index-node-esm.js
import vm from "vm";
var Hooks = class {
  /**
   * @callback HookCallback
   * @this {*|Jsep} this
   * @param {Jsep} env
   * @returns: void
   */
  /**
   * Adds the given callback to the list of callbacks for the given hook.
   *
   * The callback will be invoked when the hook it is registered for is run.
   *
   * One callback function can be registered to multiple hooks and the same hook multiple times.
   *
   * @param {string|object} name The name of the hook, or an object of callbacks keyed by name
   * @param {HookCallback|boolean} callback The callback function which is given environment variables.
   * @param {?boolean} [first=false] Will add the hook to the top of the list (defaults to the bottom)
   * @public
   */
  add(name, callback, first) {
    if (typeof arguments[0] != "string") {
      for (let name2 in arguments[0]) {
        this.add(name2, arguments[0][name2], arguments[1]);
      }
    } else {
      (Array.isArray(name) ? name : [name]).forEach(function(name2) {
        this[name2] = this[name2] || [];
        if (callback) {
          this[name2][first ? "unshift" : "push"](callback);
        }
      }, this);
    }
  }
  /**
   * Runs a hook invoking all registered callbacks with the given environment variables.
   *
   * Callbacks will be invoked synchronously and in the order in which they were registered.
   *
   * @param {string} name The name of the hook.
   * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
   * @public
   */
  run(name, env) {
    this[name] = this[name] || [];
    this[name].forEach(function(callback) {
      callback.call(env && env.context ? env.context : env, env);
    });
  }
};
var Plugins = class {
  constructor(jsep2) {
    this.jsep = jsep2;
    this.registered = {};
  }
  /**
   * @callback PluginSetup
   * @this {Jsep} jsep
   * @returns: void
   */
  /**
   * Adds the given plugin(s) to the registry
   *
   * @param {object} plugins
   * @param {string} plugins.name The name of the plugin
   * @param {PluginSetup} plugins.init The init function
   * @public
   */
  register(...plugins) {
    plugins.forEach((plugin2) => {
      if (typeof plugin2 !== "object" || !plugin2.name || !plugin2.init) {
        throw new Error("Invalid JSEP plugin format");
      }
      if (this.registered[plugin2.name]) {
        return;
      }
      plugin2.init(this.jsep);
      this.registered[plugin2.name] = plugin2;
    });
  }
};
var Jsep = class _Jsep {
  /**
   * @returns {string}
   */
  static get version() {
    return "1.4.0";
  }
  /**
   * @returns {string}
   */
  static toString() {
    return "JavaScript Expression Parser (JSEP) v" + _Jsep.version;
  }
  // ==================== CONFIG ================================
  /**
   * @method addUnaryOp
   * @param {string} op_name The name of the unary op to add
   * @returns {Jsep}
   */
  static addUnaryOp(op_name) {
    _Jsep.max_unop_len = Math.max(op_name.length, _Jsep.max_unop_len);
    _Jsep.unary_ops[op_name] = 1;
    return _Jsep;
  }
  /**
   * @method jsep.addBinaryOp
   * @param {string} op_name The name of the binary op to add
   * @param {number} precedence The precedence of the binary op (can be a float). Higher number = higher precedence
   * @param {boolean} [isRightAssociative=false] whether operator is right-associative
   * @returns {Jsep}
   */
  static addBinaryOp(op_name, precedence, isRightAssociative) {
    _Jsep.max_binop_len = Math.max(op_name.length, _Jsep.max_binop_len);
    _Jsep.binary_ops[op_name] = precedence;
    if (isRightAssociative) {
      _Jsep.right_associative.add(op_name);
    } else {
      _Jsep.right_associative.delete(op_name);
    }
    return _Jsep;
  }
  /**
   * @method addIdentifierChar
   * @param {string} char The additional character to treat as a valid part of an identifier
   * @returns {Jsep}
   */
  static addIdentifierChar(char) {
    _Jsep.additional_identifier_chars.add(char);
    return _Jsep;
  }
  /**
   * @method addLiteral
   * @param {string} literal_name The name of the literal to add
   * @param {*} literal_value The value of the literal
   * @returns {Jsep}
   */
  static addLiteral(literal_name, literal_value) {
    _Jsep.literals[literal_name] = literal_value;
    return _Jsep;
  }
  /**
   * @method removeUnaryOp
   * @param {string} op_name The name of the unary op to remove
   * @returns {Jsep}
   */
  static removeUnaryOp(op_name) {
    delete _Jsep.unary_ops[op_name];
    if (op_name.length === _Jsep.max_unop_len) {
      _Jsep.max_unop_len = _Jsep.getMaxKeyLen(_Jsep.unary_ops);
    }
    return _Jsep;
  }
  /**
   * @method removeAllUnaryOps
   * @returns {Jsep}
   */
  static removeAllUnaryOps() {
    _Jsep.unary_ops = {};
    _Jsep.max_unop_len = 0;
    return _Jsep;
  }
  /**
   * @method removeIdentifierChar
   * @param {string} char The additional character to stop treating as a valid part of an identifier
   * @returns {Jsep}
   */
  static removeIdentifierChar(char) {
    _Jsep.additional_identifier_chars.delete(char);
    return _Jsep;
  }
  /**
   * @method removeBinaryOp
   * @param {string} op_name The name of the binary op to remove
   * @returns {Jsep}
   */
  static removeBinaryOp(op_name) {
    delete _Jsep.binary_ops[op_name];
    if (op_name.length === _Jsep.max_binop_len) {
      _Jsep.max_binop_len = _Jsep.getMaxKeyLen(_Jsep.binary_ops);
    }
    _Jsep.right_associative.delete(op_name);
    return _Jsep;
  }
  /**
   * @method removeAllBinaryOps
   * @returns {Jsep}
   */
  static removeAllBinaryOps() {
    _Jsep.binary_ops = {};
    _Jsep.max_binop_len = 0;
    return _Jsep;
  }
  /**
   * @method removeLiteral
   * @param {string} literal_name The name of the literal to remove
   * @returns {Jsep}
   */
  static removeLiteral(literal_name) {
    delete _Jsep.literals[literal_name];
    return _Jsep;
  }
  /**
   * @method removeAllLiterals
   * @returns {Jsep}
   */
  static removeAllLiterals() {
    _Jsep.literals = {};
    return _Jsep;
  }
  // ==================== END CONFIG ============================
  /**
   * @returns {string}
   */
  get char() {
    return this.expr.charAt(this.index);
  }
  /**
   * @returns {number}
   */
  get code() {
    return this.expr.charCodeAt(this.index);
  }
  /**
   * @param {string} expr a string with the passed in express
   * @returns Jsep
   */
  constructor(expr) {
    this.expr = expr;
    this.index = 0;
  }
  /**
   * static top-level parser
   * @returns {jsep.Expression}
   */
  static parse(expr) {
    return new _Jsep(expr).parse();
  }
  /**
   * Get the longest key length of any object
   * @param {object} obj
   * @returns {number}
   */
  static getMaxKeyLen(obj) {
    return Math.max(0, ...Object.keys(obj).map((k) => k.length));
  }
  /**
   * `ch` is a character code in the next three functions
   * @param {number} ch
   * @returns {boolean}
   */
  static isDecimalDigit(ch) {
    return ch >= 48 && ch <= 57;
  }
  /**
   * Returns the precedence of a binary operator or `0` if it isn't a binary operator. Can be float.
   * @param {string} op_val
   * @returns {number}
   */
  static binaryPrecedence(op_val) {
    return _Jsep.binary_ops[op_val] || 0;
  }
  /**
   * Looks for start of identifier
   * @param {number} ch
   * @returns {boolean}
   */
  static isIdentifierStart(ch) {
    return ch >= 65 && ch <= 90 || // A...Z
    ch >= 97 && ch <= 122 || // a...z
    ch >= 128 && !_Jsep.binary_ops[String.fromCharCode(ch)] || // any non-ASCII that is not an operator
    _Jsep.additional_identifier_chars.has(String.fromCharCode(ch));
  }
  /**
   * @param {number} ch
   * @returns {boolean}
   */
  static isIdentifierPart(ch) {
    return _Jsep.isIdentifierStart(ch) || _Jsep.isDecimalDigit(ch);
  }
  /**
   * throw error at index of the expression
   * @param {string} message
   * @throws
   */
  throwError(message) {
    const error = new Error(message + " at character " + this.index);
    error.index = this.index;
    error.description = message;
    throw error;
  }
  /**
   * Run a given hook
   * @param {string} name
   * @param {jsep.Expression|false} [node]
   * @returns {?jsep.Expression}
   */
  runHook(name, node) {
    if (_Jsep.hooks[name]) {
      const env = {
        context: this,
        node
      };
      _Jsep.hooks.run(name, env);
      return env.node;
    }
    return node;
  }
  /**
   * Runs a given hook until one returns a node
   * @param {string} name
   * @returns {?jsep.Expression}
   */
  searchHook(name) {
    if (_Jsep.hooks[name]) {
      const env = {
        context: this
      };
      _Jsep.hooks[name].find(function(callback) {
        callback.call(env.context, env);
        return env.node;
      });
      return env.node;
    }
  }
  /**
   * Push `index` up to the next non-space character
   */
  gobbleSpaces() {
    let ch = this.code;
    while (ch === _Jsep.SPACE_CODE || ch === _Jsep.TAB_CODE || ch === _Jsep.LF_CODE || ch === _Jsep.CR_CODE) {
      ch = this.expr.charCodeAt(++this.index);
    }
    this.runHook("gobble-spaces");
  }
  /**
   * Top-level method to parse all expressions and returns compound or single node
   * @returns {jsep.Expression}
   */
  parse() {
    this.runHook("before-all");
    const nodes = this.gobbleExpressions();
    const node = nodes.length === 1 ? nodes[0] : {
      type: _Jsep.COMPOUND,
      body: nodes
    };
    return this.runHook("after-all", node);
  }
  /**
   * top-level parser (but can be reused within as well)
   * @param {number} [untilICode]
   * @returns {jsep.Expression[]}
   */
  gobbleExpressions(untilICode) {
    let nodes = [], ch_i, node;
    while (this.index < this.expr.length) {
      ch_i = this.code;
      if (ch_i === _Jsep.SEMCOL_CODE || ch_i === _Jsep.COMMA_CODE) {
        this.index++;
      } else {
        if (node = this.gobbleExpression()) {
          nodes.push(node);
        } else if (this.index < this.expr.length) {
          if (ch_i === untilICode) {
            break;
          }
          this.throwError('Unexpected "' + this.char + '"');
        }
      }
    }
    return nodes;
  }
  /**
   * The main parsing function.
   * @returns {?jsep.Expression}
   */
  gobbleExpression() {
    const node = this.searchHook("gobble-expression") || this.gobbleBinaryExpression();
    this.gobbleSpaces();
    return this.runHook("after-expression", node);
  }
  /**
   * Search for the operation portion of the string (e.g. `+`, `===`)
   * Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
   * and move down from 3 to 2 to 1 character until a matching binary operation is found
   * then, return that binary operation
   * @returns {string|boolean}
   */
  gobbleBinaryOp() {
    this.gobbleSpaces();
    let to_check = this.expr.substr(this.index, _Jsep.max_binop_len);
    let tc_len = to_check.length;
    while (tc_len > 0) {
      if (_Jsep.binary_ops.hasOwnProperty(to_check) && (!_Jsep.isIdentifierStart(this.code) || this.index + to_check.length < this.expr.length && !_Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length)))) {
        this.index += tc_len;
        return to_check;
      }
      to_check = to_check.substr(0, --tc_len);
    }
    return false;
  }
  /**
   * This function is responsible for gobbling an individual expression,
   * e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
   * @returns {?jsep.BinaryExpression}
   */
  gobbleBinaryExpression() {
    let node, biop, prec, stack, biop_info, left, right, i, cur_biop;
    left = this.gobbleToken();
    if (!left) {
      return left;
    }
    biop = this.gobbleBinaryOp();
    if (!biop) {
      return left;
    }
    biop_info = {
      value: biop,
      prec: _Jsep.binaryPrecedence(biop),
      right_a: _Jsep.right_associative.has(biop)
    };
    right = this.gobbleToken();
    if (!right) {
      this.throwError("Expected expression after " + biop);
    }
    stack = [left, biop_info, right];
    while (biop = this.gobbleBinaryOp()) {
      prec = _Jsep.binaryPrecedence(biop);
      if (prec === 0) {
        this.index -= biop.length;
        break;
      }
      biop_info = {
        value: biop,
        prec,
        right_a: _Jsep.right_associative.has(biop)
      };
      cur_biop = biop;
      const comparePrev = (prev) => biop_info.right_a && prev.right_a ? prec > prev.prec : prec <= prev.prec;
      while (stack.length > 2 && comparePrev(stack[stack.length - 2])) {
        right = stack.pop();
        biop = stack.pop().value;
        left = stack.pop();
        node = {
          type: _Jsep.BINARY_EXP,
          operator: biop,
          left,
          right
        };
        stack.push(node);
      }
      node = this.gobbleToken();
      if (!node) {
        this.throwError("Expected expression after " + cur_biop);
      }
      stack.push(biop_info, node);
    }
    i = stack.length - 1;
    node = stack[i];
    while (i > 1) {
      node = {
        type: _Jsep.BINARY_EXP,
        operator: stack[i - 1].value,
        left: stack[i - 2],
        right: node
      };
      i -= 2;
    }
    return node;
  }
  /**
   * An individual part of a binary expression:
   * e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
   * @returns {boolean|jsep.Expression}
   */
  gobbleToken() {
    let ch, to_check, tc_len, node;
    this.gobbleSpaces();
    node = this.searchHook("gobble-token");
    if (node) {
      return this.runHook("after-token", node);
    }
    ch = this.code;
    if (_Jsep.isDecimalDigit(ch) || ch === _Jsep.PERIOD_CODE) {
      return this.gobbleNumericLiteral();
    }
    if (ch === _Jsep.SQUOTE_CODE || ch === _Jsep.DQUOTE_CODE) {
      node = this.gobbleStringLiteral();
    } else if (ch === _Jsep.OBRACK_CODE) {
      node = this.gobbleArray();
    } else {
      to_check = this.expr.substr(this.index, _Jsep.max_unop_len);
      tc_len = to_check.length;
      while (tc_len > 0) {
        if (_Jsep.unary_ops.hasOwnProperty(to_check) && (!_Jsep.isIdentifierStart(this.code) || this.index + to_check.length < this.expr.length && !_Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length)))) {
          this.index += tc_len;
          const argument = this.gobbleToken();
          if (!argument) {
            this.throwError("missing unaryOp argument");
          }
          return this.runHook("after-token", {
            type: _Jsep.UNARY_EXP,
            operator: to_check,
            argument,
            prefix: true
          });
        }
        to_check = to_check.substr(0, --tc_len);
      }
      if (_Jsep.isIdentifierStart(ch)) {
        node = this.gobbleIdentifier();
        if (_Jsep.literals.hasOwnProperty(node.name)) {
          node = {
            type: _Jsep.LITERAL,
            value: _Jsep.literals[node.name],
            raw: node.name
          };
        } else if (node.name === _Jsep.this_str) {
          node = {
            type: _Jsep.THIS_EXP
          };
        }
      } else if (ch === _Jsep.OPAREN_CODE) {
        node = this.gobbleGroup();
      }
    }
    if (!node) {
      return this.runHook("after-token", false);
    }
    node = this.gobbleTokenProperty(node);
    return this.runHook("after-token", node);
  }
  /**
   * Gobble properties of of identifiers/strings/arrays/groups.
   * e.g. `foo`, `bar.baz`, `foo['bar'].baz`
   * It also gobbles function calls:
   * e.g. `Math.acos(obj.angle)`
   * @param {jsep.Expression} node
   * @returns {jsep.Expression}
   */
  gobbleTokenProperty(node) {
    this.gobbleSpaces();
    let ch = this.code;
    while (ch === _Jsep.PERIOD_CODE || ch === _Jsep.OBRACK_CODE || ch === _Jsep.OPAREN_CODE || ch === _Jsep.QUMARK_CODE) {
      let optional;
      if (ch === _Jsep.QUMARK_CODE) {
        if (this.expr.charCodeAt(this.index + 1) !== _Jsep.PERIOD_CODE) {
          break;
        }
        optional = true;
        this.index += 2;
        this.gobbleSpaces();
        ch = this.code;
      }
      this.index++;
      if (ch === _Jsep.OBRACK_CODE) {
        node = {
          type: _Jsep.MEMBER_EXP,
          computed: true,
          object: node,
          property: this.gobbleExpression()
        };
        if (!node.property) {
          this.throwError('Unexpected "' + this.char + '"');
        }
        this.gobbleSpaces();
        ch = this.code;
        if (ch !== _Jsep.CBRACK_CODE) {
          this.throwError("Unclosed [");
        }
        this.index++;
      } else if (ch === _Jsep.OPAREN_CODE) {
        node = {
          type: _Jsep.CALL_EXP,
          "arguments": this.gobbleArguments(_Jsep.CPAREN_CODE),
          callee: node
        };
      } else if (ch === _Jsep.PERIOD_CODE || optional) {
        if (optional) {
          this.index--;
        }
        this.gobbleSpaces();
        node = {
          type: _Jsep.MEMBER_EXP,
          computed: false,
          object: node,
          property: this.gobbleIdentifier()
        };
      }
      if (optional) {
        node.optional = true;
      }
      this.gobbleSpaces();
      ch = this.code;
    }
    return node;
  }
  /**
   * Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
   * keep track of everything in the numeric literal and then calling `parseFloat` on that string
   * @returns {jsep.Literal}
   */
  gobbleNumericLiteral() {
    let number = "", ch, chCode;
    while (_Jsep.isDecimalDigit(this.code)) {
      number += this.expr.charAt(this.index++);
    }
    if (this.code === _Jsep.PERIOD_CODE) {
      number += this.expr.charAt(this.index++);
      while (_Jsep.isDecimalDigit(this.code)) {
        number += this.expr.charAt(this.index++);
      }
    }
    ch = this.char;
    if (ch === "e" || ch === "E") {
      number += this.expr.charAt(this.index++);
      ch = this.char;
      if (ch === "+" || ch === "-") {
        number += this.expr.charAt(this.index++);
      }
      while (_Jsep.isDecimalDigit(this.code)) {
        number += this.expr.charAt(this.index++);
      }
      if (!_Jsep.isDecimalDigit(this.expr.charCodeAt(this.index - 1))) {
        this.throwError("Expected exponent (" + number + this.char + ")");
      }
    }
    chCode = this.code;
    if (_Jsep.isIdentifierStart(chCode)) {
      this.throwError("Variable names cannot start with a number (" + number + this.char + ")");
    } else if (chCode === _Jsep.PERIOD_CODE || number.length === 1 && number.charCodeAt(0) === _Jsep.PERIOD_CODE) {
      this.throwError("Unexpected period");
    }
    return {
      type: _Jsep.LITERAL,
      value: parseFloat(number),
      raw: number
    };
  }
  /**
   * Parses a string literal, staring with single or double quotes with basic support for escape codes
   * e.g. `"hello world"`, `'this is\nJSEP'`
   * @returns {jsep.Literal}
   */
  gobbleStringLiteral() {
    let str = "";
    const startIndex = this.index;
    const quote = this.expr.charAt(this.index++);
    let closed = false;
    while (this.index < this.expr.length) {
      let ch = this.expr.charAt(this.index++);
      if (ch === quote) {
        closed = true;
        break;
      } else if (ch === "\\") {
        ch = this.expr.charAt(this.index++);
        switch (ch) {
          case "n":
            str += "\n";
            break;
          case "r":
            str += "\r";
            break;
          case "t":
            str += "	";
            break;
          case "b":
            str += "\b";
            break;
          case "f":
            str += "\f";
            break;
          case "v":
            str += "\v";
            break;
          default:
            str += ch;
        }
      } else {
        str += ch;
      }
    }
    if (!closed) {
      this.throwError('Unclosed quote after "' + str + '"');
    }
    return {
      type: _Jsep.LITERAL,
      value: str,
      raw: this.expr.substring(startIndex, this.index)
    };
  }
  /**
   * Gobbles only identifiers
   * e.g.: `foo`, `_value`, `$x1`
   * Also, this function checks if that identifier is a literal:
   * (e.g. `true`, `false`, `null`) or `this`
   * @returns {jsep.Identifier}
   */
  gobbleIdentifier() {
    let ch = this.code, start = this.index;
    if (_Jsep.isIdentifierStart(ch)) {
      this.index++;
    } else {
      this.throwError("Unexpected " + this.char);
    }
    while (this.index < this.expr.length) {
      ch = this.code;
      if (_Jsep.isIdentifierPart(ch)) {
        this.index++;
      } else {
        break;
      }
    }
    return {
      type: _Jsep.IDENTIFIER,
      name: this.expr.slice(start, this.index)
    };
  }
  /**
   * Gobbles a list of arguments within the context of a function call
   * or array literal. This function also assumes that the opening character
   * `(` or `[` has already been gobbled, and gobbles expressions and commas
   * until the terminator character `)` or `]` is encountered.
   * e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`
   * @param {number} termination
   * @returns {jsep.Expression[]}
   */
  gobbleArguments(termination) {
    const args = [];
    let closed = false;
    let separator_count = 0;
    while (this.index < this.expr.length) {
      this.gobbleSpaces();
      let ch_i = this.code;
      if (ch_i === termination) {
        closed = true;
        this.index++;
        if (termination === _Jsep.CPAREN_CODE && separator_count && separator_count >= args.length) {
          this.throwError("Unexpected token " + String.fromCharCode(termination));
        }
        break;
      } else if (ch_i === _Jsep.COMMA_CODE) {
        this.index++;
        separator_count++;
        if (separator_count !== args.length) {
          if (termination === _Jsep.CPAREN_CODE) {
            this.throwError("Unexpected token ,");
          } else if (termination === _Jsep.CBRACK_CODE) {
            for (let arg = args.length; arg < separator_count; arg++) {
              args.push(null);
            }
          }
        }
      } else if (args.length !== separator_count && separator_count !== 0) {
        this.throwError("Expected comma");
      } else {
        const node = this.gobbleExpression();
        if (!node || node.type === _Jsep.COMPOUND) {
          this.throwError("Expected comma");
        }
        args.push(node);
      }
    }
    if (!closed) {
      this.throwError("Expected " + String.fromCharCode(termination));
    }
    return args;
  }
  /**
   * Responsible for parsing a group of things within parentheses `()`
   * that have no identifier in front (so not a function call)
   * This function assumes that it needs to gobble the opening parenthesis
   * and then tries to gobble everything within that parenthesis, assuming
   * that the next thing it should see is the close parenthesis. If not,
   * then the expression probably doesn't have a `)`
   * @returns {boolean|jsep.Expression}
   */
  gobbleGroup() {
    this.index++;
    let nodes = this.gobbleExpressions(_Jsep.CPAREN_CODE);
    if (this.code === _Jsep.CPAREN_CODE) {
      this.index++;
      if (nodes.length === 1) {
        return nodes[0];
      } else if (!nodes.length) {
        return false;
      } else {
        return {
          type: _Jsep.SEQUENCE_EXP,
          expressions: nodes
        };
      }
    } else {
      this.throwError("Unclosed (");
    }
  }
  /**
   * Responsible for parsing Array literals `[1, 2, 3]`
   * This function assumes that it needs to gobble the opening bracket
   * and then tries to gobble the expressions as arguments.
   * @returns {jsep.ArrayExpression}
   */
  gobbleArray() {
    this.index++;
    return {
      type: _Jsep.ARRAY_EXP,
      elements: this.gobbleArguments(_Jsep.CBRACK_CODE)
    };
  }
};
var hooks = new Hooks();
Object.assign(Jsep, {
  hooks,
  plugins: new Plugins(Jsep),
  // Node Types
  // ----------
  // This is the full set of types that any JSEP node can be.
  // Store them here to save space when minified
  COMPOUND: "Compound",
  SEQUENCE_EXP: "SequenceExpression",
  IDENTIFIER: "Identifier",
  MEMBER_EXP: "MemberExpression",
  LITERAL: "Literal",
  THIS_EXP: "ThisExpression",
  CALL_EXP: "CallExpression",
  UNARY_EXP: "UnaryExpression",
  BINARY_EXP: "BinaryExpression",
  ARRAY_EXP: "ArrayExpression",
  TAB_CODE: 9,
  LF_CODE: 10,
  CR_CODE: 13,
  SPACE_CODE: 32,
  PERIOD_CODE: 46,
  // '.'
  COMMA_CODE: 44,
  // ','
  SQUOTE_CODE: 39,
  // single quote
  DQUOTE_CODE: 34,
  // double quotes
  OPAREN_CODE: 40,
  // (
  CPAREN_CODE: 41,
  // )
  OBRACK_CODE: 91,
  // [
  CBRACK_CODE: 93,
  // ]
  QUMARK_CODE: 63,
  // ?
  SEMCOL_CODE: 59,
  // ;
  COLON_CODE: 58,
  // :
  // Operations
  // ----------
  // Use a quickly-accessible map to store all of the unary operators
  // Values are set to `1` (it really doesn't matter)
  unary_ops: {
    "-": 1,
    "!": 1,
    "~": 1,
    "+": 1
  },
  // Also use a map for the binary operations but set their values to their
  // binary precedence for quick reference (higher number = higher precedence)
  // see [Order of operations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
  binary_ops: {
    "||": 1,
    "??": 1,
    "&&": 2,
    "|": 3,
    "^": 4,
    "&": 5,
    "==": 6,
    "!=": 6,
    "===": 6,
    "!==": 6,
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "<<": 8,
    ">>": 8,
    ">>>": 8,
    "+": 9,
    "-": 9,
    "*": 10,
    "/": 10,
    "%": 10,
    "**": 11
  },
  // sets specific binary_ops as right-associative
  right_associative: /* @__PURE__ */ new Set(["**"]),
  // Additional valid identifier chars, apart from a-z, A-Z and 0-9 (except on the starting char)
  additional_identifier_chars: /* @__PURE__ */ new Set(["$", "_"]),
  // Literals
  // ----------
  // Store the values to return for the various literals we may encounter
  literals: {
    "true": true,
    "false": false,
    "null": null
  },
  // Except for `this`, which is special. This could be changed to something like `'self'` as well
  this_str: "this"
});
Jsep.max_unop_len = Jsep.getMaxKeyLen(Jsep.unary_ops);
Jsep.max_binop_len = Jsep.getMaxKeyLen(Jsep.binary_ops);
var jsep = (expr) => new Jsep(expr).parse();
var stdClassProps = Object.getOwnPropertyNames(class Test {
});
Object.getOwnPropertyNames(Jsep).filter((prop) => !stdClassProps.includes(prop) && jsep[prop] === void 0).forEach((m) => {
  jsep[m] = Jsep[m];
});
jsep.Jsep = Jsep;
var CONDITIONAL_EXP = "ConditionalExpression";
var ternary = {
  name: "ternary",
  init(jsep2) {
    jsep2.hooks.add("after-expression", function gobbleTernary(env) {
      if (env.node && this.code === jsep2.QUMARK_CODE) {
        this.index++;
        const test = env.node;
        const consequent = this.gobbleExpression();
        if (!consequent) {
          this.throwError("Expected expression");
        }
        this.gobbleSpaces();
        if (this.code === jsep2.COLON_CODE) {
          this.index++;
          const alternate = this.gobbleExpression();
          if (!alternate) {
            this.throwError("Expected expression");
          }
          env.node = {
            type: CONDITIONAL_EXP,
            test,
            consequent,
            alternate
          };
          if (test.operator && jsep2.binary_ops[test.operator] <= 0.9) {
            let newTest = test;
            while (newTest.right.operator && jsep2.binary_ops[newTest.right.operator] <= 0.9) {
              newTest = newTest.right;
            }
            env.node.test = newTest.right;
            newTest.right = env.node;
            env.node = test;
          }
        } else {
          this.throwError("Expected :");
        }
      }
    });
  }
};
jsep.plugins.register(ternary);
var FSLASH_CODE = 47;
var BSLASH_CODE = 92;
var index = {
  name: "regex",
  init(jsep2) {
    jsep2.hooks.add("gobble-token", function gobbleRegexLiteral(env) {
      if (this.code === FSLASH_CODE) {
        const patternIndex = ++this.index;
        let inCharSet = false;
        while (this.index < this.expr.length) {
          if (this.code === FSLASH_CODE && !inCharSet) {
            const pattern = this.expr.slice(patternIndex, this.index);
            let flags = "";
            while (++this.index < this.expr.length) {
              const code = this.code;
              if (code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 48 && code <= 57) {
                flags += this.char;
              } else {
                break;
              }
            }
            let value;
            try {
              value = new RegExp(pattern, flags);
            } catch (e) {
              this.throwError(e.message);
            }
            env.node = {
              type: jsep2.LITERAL,
              value,
              raw: this.expr.slice(patternIndex - 1, this.index)
            };
            env.node = this.gobbleTokenProperty(env.node);
            return env.node;
          }
          if (this.code === jsep2.OBRACK_CODE) {
            inCharSet = true;
          } else if (inCharSet && this.code === jsep2.CBRACK_CODE) {
            inCharSet = false;
          }
          this.index += this.code === BSLASH_CODE ? 2 : 1;
        }
        this.throwError("Unclosed Regex");
      }
    });
  }
};
var PLUS_CODE = 43;
var MINUS_CODE = 45;
var plugin = {
  name: "assignment",
  assignmentOperators: /* @__PURE__ */ new Set(["=", "*=", "**=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=", "||=", "&&=", "??="]),
  updateOperators: [PLUS_CODE, MINUS_CODE],
  assignmentPrecedence: 0.9,
  init(jsep2) {
    const updateNodeTypes = [jsep2.IDENTIFIER, jsep2.MEMBER_EXP];
    plugin.assignmentOperators.forEach((op) => jsep2.addBinaryOp(op, plugin.assignmentPrecedence, true));
    jsep2.hooks.add("gobble-token", function gobbleUpdatePrefix(env) {
      const code = this.code;
      if (plugin.updateOperators.some((c) => c === code && c === this.expr.charCodeAt(this.index + 1))) {
        this.index += 2;
        env.node = {
          type: "UpdateExpression",
          operator: code === PLUS_CODE ? "++" : "--",
          argument: this.gobbleTokenProperty(this.gobbleIdentifier()),
          prefix: true
        };
        if (!env.node.argument || !updateNodeTypes.includes(env.node.argument.type)) {
          this.throwError(`Unexpected ${env.node.operator}`);
        }
      }
    });
    jsep2.hooks.add("after-token", function gobbleUpdatePostfix(env) {
      if (env.node) {
        const code = this.code;
        if (plugin.updateOperators.some((c) => c === code && c === this.expr.charCodeAt(this.index + 1))) {
          if (!updateNodeTypes.includes(env.node.type)) {
            this.throwError(`Unexpected ${env.node.operator}`);
          }
          this.index += 2;
          env.node = {
            type: "UpdateExpression",
            operator: code === PLUS_CODE ? "++" : "--",
            argument: env.node,
            prefix: false
          };
        }
      }
    });
    jsep2.hooks.add("after-expression", function gobbleAssignment(env) {
      if (env.node) {
        updateBinariesToAssignments(env.node);
      }
    });
    function updateBinariesToAssignments(node) {
      if (plugin.assignmentOperators.has(node.operator)) {
        node.type = "AssignmentExpression";
        updateBinariesToAssignments(node.left);
        updateBinariesToAssignments(node.right);
      } else if (!node.operator) {
        Object.values(node).forEach((val) => {
          if (val && typeof val === "object") {
            updateBinariesToAssignments(val);
          }
        });
      }
    }
  }
};
jsep.plugins.register(index, plugin);
jsep.addUnaryOp("typeof");
jsep.addUnaryOp("void");
jsep.addLiteral("null", null);
jsep.addLiteral("undefined", void 0);
var BLOCKED_PROTO_PROPERTIES = /* @__PURE__ */ new Set(["constructor", "__proto__", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"]);
var SafeEval = {
  /**
   * @param {jsep.Expression} ast
   * @param {Record<string, any>} subs
   */
  evalAst(ast, subs) {
    switch (ast.type) {
      case "BinaryExpression":
      case "LogicalExpression":
        return SafeEval.evalBinaryExpression(ast, subs);
      case "Compound":
        return SafeEval.evalCompound(ast, subs);
      case "ConditionalExpression":
        return SafeEval.evalConditionalExpression(ast, subs);
      case "Identifier":
        return SafeEval.evalIdentifier(ast, subs);
      case "Literal":
        return SafeEval.evalLiteral(ast, subs);
      case "MemberExpression":
        return SafeEval.evalMemberExpression(ast, subs);
      case "UnaryExpression":
        return SafeEval.evalUnaryExpression(ast, subs);
      case "ArrayExpression":
        return SafeEval.evalArrayExpression(ast, subs);
      case "CallExpression":
        return SafeEval.evalCallExpression(ast, subs);
      case "AssignmentExpression":
        return SafeEval.evalAssignmentExpression(ast, subs);
      default:
        throw SyntaxError("Unexpected expression", ast);
    }
  },
  evalBinaryExpression(ast, subs) {
    const result = {
      "||": (a, b) => a || b(),
      "&&": (a, b) => a && b(),
      "|": (a, b) => a | b(),
      "^": (a, b) => a ^ b(),
      "&": (a, b) => a & b(),
      // eslint-disable-next-line eqeqeq -- API
      "==": (a, b) => a == b(),
      // eslint-disable-next-line eqeqeq -- API
      "!=": (a, b) => a != b(),
      "===": (a, b) => a === b(),
      "!==": (a, b) => a !== b(),
      "<": (a, b) => a < b(),
      ">": (a, b) => a > b(),
      "<=": (a, b) => a <= b(),
      ">=": (a, b) => a >= b(),
      "<<": (a, b) => a << b(),
      ">>": (a, b) => a >> b(),
      ">>>": (a, b) => a >>> b(),
      "+": (a, b) => a + b(),
      "-": (a, b) => a - b(),
      "*": (a, b) => a * b(),
      "/": (a, b) => a / b(),
      "%": (a, b) => a % b()
    }[ast.operator](SafeEval.evalAst(ast.left, subs), () => SafeEval.evalAst(ast.right, subs));
    return result;
  },
  evalCompound(ast, subs) {
    let last;
    for (let i = 0; i < ast.body.length; i++) {
      if (ast.body[i].type === "Identifier" && ["var", "let", "const"].includes(ast.body[i].name) && ast.body[i + 1] && ast.body[i + 1].type === "AssignmentExpression") {
        i += 1;
      }
      const expr = ast.body[i];
      last = SafeEval.evalAst(expr, subs);
    }
    return last;
  },
  evalConditionalExpression(ast, subs) {
    if (SafeEval.evalAst(ast.test, subs)) {
      return SafeEval.evalAst(ast.consequent, subs);
    }
    return SafeEval.evalAst(ast.alternate, subs);
  },
  evalIdentifier(ast, subs) {
    if (Object.hasOwn(subs, ast.name)) {
      return subs[ast.name];
    }
    throw ReferenceError(`${ast.name} is not defined`);
  },
  evalLiteral(ast) {
    return ast.value;
  },
  evalMemberExpression(ast, subs) {
    const prop = String(
      // NOTE: `String(value)` throws error when
      // value has overwritten the toString method to return non-string
      // i.e. `value = {toString: () => []}`
      ast.computed ? SafeEval.evalAst(ast.property) : ast.property.name
      // `object.property` property is Identifier
    );
    const obj = SafeEval.evalAst(ast.object, subs);
    if (obj === void 0 || obj === null) {
      throw TypeError(`Cannot read properties of ${obj} (reading '${prop}')`);
    }
    if (!Object.hasOwn(obj, prop) && BLOCKED_PROTO_PROPERTIES.has(prop)) {
      throw TypeError(`Cannot read properties of ${obj} (reading '${prop}')`);
    }
    const result = obj[prop];
    if (typeof result === "function") {
      return result.bind(obj);
    }
    return result;
  },
  evalUnaryExpression(ast, subs) {
    const result = {
      "-": (a) => -SafeEval.evalAst(a, subs),
      "!": (a) => !SafeEval.evalAst(a, subs),
      "~": (a) => ~SafeEval.evalAst(a, subs),
      // eslint-disable-next-line no-implicit-coercion -- API
      "+": (a) => +SafeEval.evalAst(a, subs),
      typeof: (a) => typeof SafeEval.evalAst(a, subs),
      // eslint-disable-next-line no-void, sonarjs/void-use -- feature
      void: (a) => void SafeEval.evalAst(a, subs)
    }[ast.operator](ast.argument);
    return result;
  },
  evalArrayExpression(ast, subs) {
    return ast.elements.map((el) => SafeEval.evalAst(el, subs));
  },
  evalCallExpression(ast, subs) {
    const args = ast.arguments.map((arg) => SafeEval.evalAst(arg, subs));
    const func = SafeEval.evalAst(ast.callee, subs);
    if (func === Function) {
      throw new Error("Function constructor is disabled");
    }
    return func(...args);
  },
  evalAssignmentExpression(ast, subs) {
    if (ast.left.type !== "Identifier") {
      throw SyntaxError("Invalid left-hand side in assignment");
    }
    const id = ast.left.name;
    const value = SafeEval.evalAst(ast.right, subs);
    subs[id] = value;
    return subs[id];
  }
};
var SafeScript = class {
  /**
   * @param {string} expr Expression to evaluate
   */
  constructor(expr) {
    this.code = expr;
    this.ast = jsep(this.code);
  }
  /**
   * @param {object} context Object whose items will be added
   *   to evaluation
   * @returns {EvaluatedResult} Result of evaluated code
   */
  runInNewContext(context) {
    const keyMap = Object.assign(/* @__PURE__ */ Object.create(null), context);
    return SafeEval.evalAst(this.ast, keyMap);
  }
};
function push(arr, item) {
  arr = arr.slice();
  arr.push(item);
  return arr;
}
function unshift(item, arr) {
  arr = arr.slice();
  arr.unshift(item);
  return arr;
}
var NewError = class extends Error {
  /**
   * @param {AnyResult} value The evaluated scalar value
   */
  constructor(value) {
    super('JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)');
    this.avoidNew = true;
    this.value = value;
    this.name = "NewError";
  }
};
function JSONPath(opts, expr, obj, callback, otherTypeCallback) {
  if (!(this instanceof JSONPath)) {
    try {
      return new JSONPath(opts, expr, obj, callback, otherTypeCallback);
    } catch (e) {
      if (!e.avoidNew) {
        throw e;
      }
      return e.value;
    }
  }
  if (typeof opts === "string") {
    otherTypeCallback = callback;
    callback = obj;
    obj = expr;
    expr = opts;
    opts = null;
  }
  const optObj = opts && typeof opts === "object";
  opts = opts || {};
  this.json = opts.json || obj;
  this.path = opts.path || expr;
  this.resultType = opts.resultType || "value";
  this.flatten = opts.flatten || false;
  this.wrap = Object.hasOwn(opts, "wrap") ? opts.wrap : true;
  this.sandbox = opts.sandbox || {};
  this.eval = opts.eval === void 0 ? "safe" : opts.eval;
  this.ignoreEvalErrors = typeof opts.ignoreEvalErrors === "undefined" ? false : opts.ignoreEvalErrors;
  this.parent = opts.parent || null;
  this.parentProperty = opts.parentProperty || null;
  this.callback = opts.callback || callback || null;
  this.otherTypeCallback = opts.otherTypeCallback || otherTypeCallback || function() {
    throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.");
  };
  if (opts.autostart !== false) {
    const args = {
      path: optObj ? opts.path : expr
    };
    if (!optObj) {
      args.json = obj;
    } else if ("json" in opts) {
      args.json = opts.json;
    }
    const ret = this.evaluate(args);
    if (!ret || typeof ret !== "object") {
      throw new NewError(ret);
    }
    return ret;
  }
}
JSONPath.prototype.evaluate = function(expr, json, callback, otherTypeCallback) {
  let currParent = this.parent, currParentProperty = this.parentProperty;
  let {
    flatten,
    wrap
  } = this;
  this.currResultType = this.resultType;
  this.currEval = this.eval;
  this.currSandbox = this.sandbox;
  callback = callback || this.callback;
  this.currOtherTypeCallback = otherTypeCallback || this.otherTypeCallback;
  json = json || this.json;
  expr = expr || this.path;
  if (expr && typeof expr === "object" && !Array.isArray(expr)) {
    if (!expr.path && expr.path !== "") {
      throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');
    }
    if (!Object.hasOwn(expr, "json")) {
      throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');
    }
    ({
      json
    } = expr);
    flatten = Object.hasOwn(expr, "flatten") ? expr.flatten : flatten;
    this.currResultType = Object.hasOwn(expr, "resultType") ? expr.resultType : this.currResultType;
    this.currSandbox = Object.hasOwn(expr, "sandbox") ? expr.sandbox : this.currSandbox;
    wrap = Object.hasOwn(expr, "wrap") ? expr.wrap : wrap;
    this.currEval = Object.hasOwn(expr, "eval") ? expr.eval : this.currEval;
    callback = Object.hasOwn(expr, "callback") ? expr.callback : callback;
    this.currOtherTypeCallback = Object.hasOwn(expr, "otherTypeCallback") ? expr.otherTypeCallback : this.currOtherTypeCallback;
    currParent = Object.hasOwn(expr, "parent") ? expr.parent : currParent;
    currParentProperty = Object.hasOwn(expr, "parentProperty") ? expr.parentProperty : currParentProperty;
    expr = expr.path;
  }
  currParent = currParent || null;
  currParentProperty = currParentProperty || null;
  if (Array.isArray(expr)) {
    expr = JSONPath.toPathString(expr);
  }
  if (!expr && expr !== "" || !json) {
    return void 0;
  }
  const exprList = JSONPath.toPathArray(expr);
  if (exprList[0] === "$" && exprList.length > 1) {
    exprList.shift();
  }
  this._hasParentSelector = null;
  const result = this._trace(exprList, json, ["$"], currParent, currParentProperty, callback).filter(function(ea) {
    return ea && !ea.isParentSelector;
  });
  if (!result.length) {
    return wrap ? [] : void 0;
  }
  if (!wrap && result.length === 1 && !result[0].hasArrExpr) {
    return this._getPreferredOutput(result[0]);
  }
  return result.reduce((rslt, ea) => {
    const valOrPath = this._getPreferredOutput(ea);
    if (flatten && Array.isArray(valOrPath)) {
      rslt = rslt.concat(valOrPath);
    } else {
      rslt.push(valOrPath);
    }
    return rslt;
  }, []);
};
JSONPath.prototype._getPreferredOutput = function(ea) {
  const resultType = this.currResultType;
  switch (resultType) {
    case "all": {
      const path5 = Array.isArray(ea.path) ? ea.path : JSONPath.toPathArray(ea.path);
      ea.pointer = JSONPath.toPointer(path5);
      ea.path = typeof ea.path === "string" ? ea.path : JSONPath.toPathString(ea.path);
      return ea;
    }
    case "value":
    case "parent":
    case "parentProperty":
      return ea[resultType];
    case "path":
      return JSONPath.toPathString(ea[resultType]);
    case "pointer":
      return JSONPath.toPointer(ea.path);
    default:
      throw new TypeError("Unknown result type");
  }
};
JSONPath.prototype._handleCallback = function(fullRetObj, callback, type) {
  if (callback) {
    const preferredOutput = this._getPreferredOutput(fullRetObj);
    fullRetObj.path = typeof fullRetObj.path === "string" ? fullRetObj.path : JSONPath.toPathString(fullRetObj.path);
    callback(preferredOutput, type, fullRetObj);
  }
};
JSONPath.prototype._trace = function(expr, val, path5, parent, parentPropName, callback, hasArrExpr, literalPriority) {
  let retObj;
  if (!expr.length) {
    retObj = {
      path: path5,
      value: val,
      parent,
      parentProperty: parentPropName,
      hasArrExpr
    };
    this._handleCallback(retObj, callback, "value");
    return retObj;
  }
  const loc = expr[0], x = expr.slice(1);
  const ret = [];
  function addRet(elems) {
    if (Array.isArray(elems)) {
      elems.forEach((t) => {
        ret.push(t);
      });
    } else {
      ret.push(elems);
    }
  }
  if ((typeof loc !== "string" || literalPriority) && val && Object.hasOwn(val, loc)) {
    addRet(this._trace(x, val[loc], push(path5, loc), val, loc, callback, hasArrExpr));
  } else if (loc === "*") {
    this._walk(val, (m) => {
      addRet(this._trace(x, val[m], push(path5, m), val, m, callback, true, true));
    });
  } else if (loc === "..") {
    addRet(this._trace(x, val, path5, parent, parentPropName, callback, hasArrExpr));
    this._walk(val, (m) => {
      if (typeof val[m] === "object") {
        addRet(this._trace(expr.slice(), val[m], push(path5, m), val, m, callback, true));
      }
    });
  } else if (loc === "^") {
    this._hasParentSelector = true;
    return {
      path: path5.slice(0, -1),
      expr: x,
      isParentSelector: true
    };
  } else if (loc === "~") {
    retObj = {
      path: push(path5, loc),
      value: parentPropName,
      parent,
      parentProperty: null
    };
    this._handleCallback(retObj, callback, "property");
    return retObj;
  } else if (loc === "$") {
    addRet(this._trace(x, val, path5, null, null, callback, hasArrExpr));
  } else if (/^(-?\d*):(-?\d*):?(\d*)$/u.test(loc)) {
    addRet(this._slice(loc, x, val, path5, parent, parentPropName, callback));
  } else if (loc.indexOf("?(") === 0) {
    if (this.currEval === false) {
      throw new Error("Eval [?(expr)] prevented in JSONPath expression.");
    }
    const safeLoc = loc.replace(/^\?\((.*?)\)$/u, "$1");
    const nested = /@.?([^?]*)[['](\??\(.*?\))(?!.\)\])[\]']/gu.exec(safeLoc);
    if (nested) {
      this._walk(val, (m) => {
        const npath = [nested[2]];
        const nvalue = nested[1] ? val[m][nested[1]] : val[m];
        const filterResults = this._trace(npath, nvalue, path5, parent, parentPropName, callback, true);
        if (filterResults.length > 0) {
          addRet(this._trace(x, val[m], push(path5, m), val, m, callback, true));
        }
      });
    } else {
      this._walk(val, (m) => {
        if (this._eval(safeLoc, val[m], m, path5, parent, parentPropName)) {
          addRet(this._trace(x, val[m], push(path5, m), val, m, callback, true));
        }
      });
    }
  } else if (loc[0] === "(") {
    if (this.currEval === false) {
      throw new Error("Eval [(expr)] prevented in JSONPath expression.");
    }
    addRet(this._trace(unshift(this._eval(loc, val, path5.at(-1), path5.slice(0, -1), parent, parentPropName), x), val, path5, parent, parentPropName, callback, hasArrExpr));
  } else if (loc[0] === "@") {
    let addType = false;
    const valueType = loc.slice(1, -2);
    switch (valueType) {
      case "scalar":
        if (!val || !["object", "function"].includes(typeof val)) {
          addType = true;
        }
        break;
      case "boolean":
      case "string":
      case "undefined":
      case "function":
        if (typeof val === valueType) {
          addType = true;
        }
        break;
      case "integer":
        if (Number.isFinite(val) && !(val % 1)) {
          addType = true;
        }
        break;
      case "number":
        if (Number.isFinite(val)) {
          addType = true;
        }
        break;
      case "nonFinite":
        if (typeof val === "number" && !Number.isFinite(val)) {
          addType = true;
        }
        break;
      case "object":
        if (val && typeof val === valueType) {
          addType = true;
        }
        break;
      case "array":
        if (Array.isArray(val)) {
          addType = true;
        }
        break;
      case "other":
        addType = this.currOtherTypeCallback(val, path5, parent, parentPropName);
        break;
      case "null":
        if (val === null) {
          addType = true;
        }
        break;
      /* c8 ignore next 2 */
      default:
        throw new TypeError("Unknown value type " + valueType);
    }
    if (addType) {
      retObj = {
        path: path5,
        value: val,
        parent,
        parentProperty: parentPropName
      };
      this._handleCallback(retObj, callback, "value");
      return retObj;
    }
  } else if (loc[0] === "`" && val && Object.hasOwn(val, loc.slice(1))) {
    const locProp = loc.slice(1);
    addRet(this._trace(x, val[locProp], push(path5, locProp), val, locProp, callback, hasArrExpr, true));
  } else if (loc.includes(",")) {
    const parts = loc.split(",");
    for (const part of parts) {
      addRet(this._trace(unshift(part, x), val, path5, parent, parentPropName, callback, true));
    }
  } else if (!literalPriority && val && Object.hasOwn(val, loc)) {
    addRet(this._trace(x, val[loc], push(path5, loc), val, loc, callback, hasArrExpr, true));
  }
  if (this._hasParentSelector) {
    for (let t = 0; t < ret.length; t++) {
      const rett = ret[t];
      if (rett && rett.isParentSelector) {
        const tmp = this._trace(rett.expr, val, rett.path, parent, parentPropName, callback, hasArrExpr);
        if (Array.isArray(tmp)) {
          ret[t] = tmp[0];
          const tl = tmp.length;
          for (let tt = 1; tt < tl; tt++) {
            t++;
            ret.splice(t, 0, tmp[tt]);
          }
        } else {
          ret[t] = tmp;
        }
      }
    }
  }
  return ret;
};
JSONPath.prototype._walk = function(val, f) {
  if (Array.isArray(val)) {
    const n = val.length;
    for (let i = 0; i < n; i++) {
      f(i);
    }
  } else if (val && typeof val === "object") {
    Object.keys(val).forEach((m) => {
      f(m);
    });
  }
};
JSONPath.prototype._slice = function(loc, expr, val, path5, parent, parentPropName, callback) {
  if (!Array.isArray(val)) {
    return void 0;
  }
  const len = val.length, parts = loc.split(":"), step = parts[2] && Number.parseInt(parts[2]) || 1;
  let start = parts[0] && Number.parseInt(parts[0]) || 0, end = parts[1] && Number.parseInt(parts[1]) || len;
  start = start < 0 ? Math.max(0, start + len) : Math.min(len, start);
  end = end < 0 ? Math.max(0, end + len) : Math.min(len, end);
  const ret = [];
  for (let i = start; i < end; i += step) {
    const tmp = this._trace(unshift(i, expr), val, path5, parent, parentPropName, callback, true);
    tmp.forEach((t) => {
      ret.push(t);
    });
  }
  return ret;
};
JSONPath.prototype._eval = function(code, _v, _vname, path5, parent, parentPropName) {
  this.currSandbox._$_parentProperty = parentPropName;
  this.currSandbox._$_parent = parent;
  this.currSandbox._$_property = _vname;
  this.currSandbox._$_root = this.json;
  this.currSandbox._$_v = _v;
  const containsPath = code.includes("@path");
  if (containsPath) {
    this.currSandbox._$_path = JSONPath.toPathString(path5.concat([_vname]));
  }
  const scriptCacheKey = this.currEval + "Script:" + code;
  if (!JSONPath.cache[scriptCacheKey]) {
    let script = code.replaceAll("@parentProperty", "_$_parentProperty").replaceAll("@parent", "_$_parent").replaceAll("@property", "_$_property").replaceAll("@root", "_$_root").replaceAll(/@([.\s)[])/gu, "_$_v$1");
    if (containsPath) {
      script = script.replaceAll("@path", "_$_path");
    }
    if (this.currEval === "safe" || this.currEval === true || this.currEval === void 0) {
      JSONPath.cache[scriptCacheKey] = new this.safeVm.Script(script);
    } else if (this.currEval === "native") {
      JSONPath.cache[scriptCacheKey] = new this.vm.Script(script);
    } else if (typeof this.currEval === "function" && this.currEval.prototype && Object.hasOwn(this.currEval.prototype, "runInNewContext")) {
      const CurrEval = this.currEval;
      JSONPath.cache[scriptCacheKey] = new CurrEval(script);
    } else if (typeof this.currEval === "function") {
      JSONPath.cache[scriptCacheKey] = {
        runInNewContext: (context) => this.currEval(script, context)
      };
    } else {
      throw new TypeError(`Unknown "eval" property "${this.currEval}"`);
    }
  }
  try {
    return JSONPath.cache[scriptCacheKey].runInNewContext(this.currSandbox);
  } catch (e) {
    if (this.ignoreEvalErrors) {
      return false;
    }
    throw new Error("jsonPath: " + e.message + ": " + code);
  }
};
JSONPath.cache = {};
JSONPath.toPathString = function(pathArr) {
  const x = pathArr, n = x.length;
  let p = "$";
  for (let i = 1; i < n; i++) {
    if (!/^(~|\^|@.*?\(\))$/u.test(x[i])) {
      p += /^[0-9*]+$/u.test(x[i]) ? "[" + x[i] + "]" : "['" + x[i] + "']";
    }
  }
  return p;
};
JSONPath.toPointer = function(pointer) {
  const x = pointer, n = x.length;
  let p = "";
  for (let i = 1; i < n; i++) {
    if (!/^(~|\^|@.*?\(\))$/u.test(x[i])) {
      p += "/" + x[i].toString().replaceAll("~", "~0").replaceAll("/", "~1");
    }
  }
  return p;
};
JSONPath.toPathArray = function(expr) {
  const {
    cache
  } = JSONPath;
  if (cache[expr]) {
    return cache[expr].concat();
  }
  const subx = [];
  const normalized = expr.replaceAll(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/gu, ";$&;").replaceAll(/[['](\??\(.*?\))[\]'](?!.\])/gu, function($0, $1) {
    return "[#" + (subx.push($1) - 1) + "]";
  }).replaceAll(/\[['"]([^'\]]*)['"]\]/gu, function($0, prop) {
    return "['" + prop.replaceAll(".", "%@%").replaceAll("~", "%%@@%%") + "']";
  }).replaceAll("~", ";~;").replaceAll(/['"]?\.['"]?(?![^[]*\])|\[['"]?/gu, ";").replaceAll("%@%", ".").replaceAll("%%@@%%", "~").replaceAll(/(?:;)?(\^+)(?:;)?/gu, function($0, ups) {
    return ";" + ups.split("").join(";") + ";";
  }).replaceAll(/;;;|;;/gu, ";..;").replaceAll(/;$|'?\]|'$/gu, "");
  const exprList = normalized.split(";").map(function(exp) {
    const match = exp.match(/#(\d+)/u);
    return !match || !match[1] ? exp : subx[match[1]];
  });
  cache[expr] = exprList;
  return cache[expr].concat();
};
JSONPath.prototype.safeVm = {
  Script: SafeScript
};
JSONPath.prototype.vm = vm;

// main/services/watch-service.ts
import { app as app2, ipcMain as ipcMain2, logger as logger4 } from "@glaze/core/backend";

// main/services/watch-store.ts
import * as fs from "fs";
import * as path from "path";
import { app, logger as logger2 } from "@glaze/core/backend";

// main/services/sound-options.ts
var SOUND_OPTIONS = ["none", "gentle", "alarm", "siren", "foghorn"];
var INTENSITY = {
  none: 0,
  gentle: 1,
  alarm: 2,
  siren: 3,
  foghorn: 4
};
function isSoundOption(value) {
  return typeof value === "string" && SOUND_OPTIONS.includes(value);
}
function coerceSoundOption(value) {
  if (isSoundOption(value)) return value;
  return value === false ? "none" : "gentle";
}
function pickLoudestSound(sounds) {
  return sounds.reduce((loudest, s) => INTENSITY[s] > INTENSITY[loudest] ? s : loudest, "none");
}

// main/services/watch-store.ts
var DATA_DIR = app.getPath("userData");
var FILE = path.join(DATA_DIR, "watches.json");
function coerceWatch(value) {
  if (typeof value !== "object" || value === null) return null;
  const v = value;
  if (typeof v.id !== "string" || typeof v.url !== "string") return null;
  return {
    id: v.id,
    url: v.url,
    label: typeof v.label === "string" ? v.label : "",
    intervalSeconds: typeof v.intervalSeconds === "number" ? v.intervalSeconds : 300,
    sound: coerceSoundOption(v.sound),
    jsonNormalize: v.jsonNormalize === true,
    ignorePaths: Array.isArray(v.ignorePaths) ? v.ignorePaths.filter((p) => typeof p === "string") : [],
    cacheBust: v.cacheBust === true,
    showDiff: v.showDiff === true,
    enabled: v.enabled !== false,
    lastHash: typeof v.lastHash === "string" ? v.lastHash : null,
    lastCheckedAt: typeof v.lastCheckedAt === "number" ? v.lastCheckedAt : null,
    lastChangedAt: typeof v.lastChangedAt === "number" ? v.lastChangedAt : null,
    lastStatus: v.lastStatus === "watching" || v.lastStatus === "changed" || v.lastStatus === "error" ? v.lastStatus : "idle",
    lastError: typeof v.lastError === "string" ? v.lastError : null
  };
}
async function loadWatches() {
  try {
    const raw = await fs.promises.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(coerceWatch).filter((w) => w !== null);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    logger2.error("watch-store", "Failed to load watches.json", {
      error: err instanceof Error ? err.message : String(err)
    });
    return [];
  }
}
async function saveWatches(watches2) {
  await fs.promises.mkdir(DATA_DIR, { recursive: true });
  await fs.promises.writeFile(FILE, JSON.stringify(watches2, null, 2), "utf-8");
}

// main/services/text-diff.ts
var MAX_LINES_TO_DIFF = 2e3;
var CONTEXT_LINES = 2;
var MAX_OUTPUT_LINES = 300;
function lcsDiff(oldLines, newLines) {
  const n = oldLines.length;
  const m = newLines.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      dp[i2][j2] = oldLines[i2] === newLines[j2] ? dp[i2 + 1][j2 + 1] + 1 : Math.max(dp[i2 + 1][j2], dp[i2][j2 + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (oldLines[i] === newLines[j]) {
      ops.push({ type: "context", text: oldLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", text: oldLines[i] });
      i++;
    } else {
      ops.push({ type: "add", text: newLines[j] });
      j++;
    }
  }
  while (i < n) {
    ops.push({ type: "remove", text: oldLines[i] });
    i++;
  }
  while (j < m) {
    ops.push({ type: "add", text: newLines[j] });
    j++;
  }
  return ops;
}
function condense(ops) {
  const keep = new Array(ops.length).fill(false);
  for (let idx = 0; idx < ops.length; idx++) {
    if (ops[idx].type === "context") continue;
    for (let k = Math.max(0, idx - CONTEXT_LINES); k <= Math.min(ops.length - 1, idx + CONTEXT_LINES); k++) {
      keep[k] = true;
    }
  }
  const result = [];
  let skipped = 0;
  for (let idx = 0; idx < ops.length; idx++) {
    if (!keep[idx]) {
      skipped++;
      continue;
    }
    if (skipped > 0) {
      result.push({ type: "skip", text: `${skipped} unchanged line${skipped === 1 ? "" : "s"}` });
      skipped = 0;
    }
    result.push(ops[idx]);
  }
  if (skipped > 0) {
    result.push({ type: "skip", text: `${skipped} unchanged line${skipped === 1 ? "" : "s"}` });
  }
  return result;
}
function computeLineDiff(oldText, newText) {
  if (oldText === newText) return [];
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  if (oldLines.length > MAX_LINES_TO_DIFF || newLines.length > MAX_LINES_TO_DIFF) {
    return [{ type: "skip", text: "Diff not shown \u2014 content is too large to compare line by line" }];
  }
  const condensed = condense(lcsDiff(oldLines, newLines));
  if (condensed.length <= MAX_OUTPUT_LINES) return condensed;
  const truncated = condensed.slice(0, MAX_OUTPUT_LINES);
  truncated.push({ type: "skip", text: "Diff truncated \u2014 too many changed lines to display" });
  return truncated;
}

// main/windows/alert-window.ts
import { BrowserWindow, ipcMain, logger as logger3, shell } from "@glaze/core/backend";

// main/windows/window-paths.ts
import * as fs2 from "fs";
import * as path2 from "path";
import { fileURLToPath, pathToFileURL } from "url";
var currentFilePath = fileURLToPath(import.meta.url);
var currentDirPath = path2.dirname(currentFilePath);
var BUILD_ROOT = path2.resolve(currentDirPath, "..");
function resolveWindowHtml(htmlFileName) {
  return path2.join(BUILD_ROOT, htmlFileName);
}
function getWindowFileUrl(htmlFileName) {
  return pathToFileURL(resolveWindowHtml(htmlFileName)).toString();
}
function getPreloadPath() {
  return path2.join(BUILD_ROOT, "assets", "preload.js");
}
async function getWindowUrl(htmlFileName) {
  const devServerHostFile = path2.join(BUILD_ROOT, "..", ".devserverhost");
  if (fs2.existsSync(devServerHostFile)) {
    try {
      const devServerHost = (await fs2.promises.readFile(devServerHostFile, "utf-8")).trim();
      if (devServerHost) {
        return `${devServerHost}/${htmlFileName}`;
      }
    } catch {
    }
  }
  return getWindowFileUrl(htmlFileName);
}

// main/windows/alert-window.ts
var alertWindow = null;
var pending = /* @__PURE__ */ new Map();
function getPendingChanges() {
  return Array.from(pending.values()).sort((a, b) => b.changedAt - a.changedAt);
}
function getAlertPayload() {
  const changes = getPendingChanges();
  return { changes, sound: pickLoudestSound(changes.map((c) => c.sound)) };
}
function broadcastAlert() {
  ipcMain.broadcast("alert:changed", getAlertPayload());
}
function dismissAlerts() {
  pending.clear();
  if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
}
async function openChangedUrl(id) {
  const change = pending.get(id);
  if (change) await shell.openExternal(change.url);
  pending.delete(id);
  if (pending.size === 0) {
    if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
  } else {
    broadcastAlert();
  }
}
async function showChangeAlert(change, sound) {
  pending.set(change.id, change);
  if (alertWindow && !alertWindow.isDestroyed()) {
    broadcastAlert();
    alertWindow.show();
    alertWindow.moveTop();
    return;
  }
  logger3.info("alert-window", "Opening change alert", { url: change.url });
  alertWindow = new BrowserWindow({
    windowKey: "change-alert",
    width: 440,
    height: 340,
    minWidth: 380,
    minHeight: 260,
    frame: true,
    titleBarStyle: "hidden",
    toolbarStyle: "none",
    backgroundColor: "#00000000",
    vibrancy: "hud",
    visualEffectState: "active",
    alwaysOnTop: true,
    hasShadow: true,
    center: true,
    visibleOnAllWorkspaces: true,
    hiddenInMissionControl: true,
    show: false,
    webPreferences: { preload: getPreloadPath() }
  });
  alertWindow.setAlwaysOnTop(true, "floating");
  alertWindow.setWindowButtonVisibility(false);
  alertWindow.once("ready-to-show", () => {
    alertWindow?.show();
    alertWindow?.moveTop();
  });
  alertWindow.on("closed", () => {
    alertWindow = null;
  });
  void sound;
  await alertWindow.loadURL(await getWindowUrl("alert-window.html"));
}

// main/services/watch-service.ts
var MIN_INTERVAL_SECONDS = 5;
var FETCH_TIMEOUT_MS = 2e4;
var timers = /* @__PURE__ */ new Map();
var watches = [];
var started = false;
var lastCompared = /* @__PURE__ */ new Map();
function getWatches() {
  return watches;
}
function broadcast() {
  ipcMain2.broadcast("watches:changed", { watches });
}
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}
function stripJsonPath(root, path5) {
  const pointers = JSONPath({ path: path5, json: root, resultType: "pointer", eval: false });
  const sorted = [...pointers].sort((a, b) => b.length - a.length);
  for (const pointer of sorted) {
    if (pointer === "") continue;
    const segments = pointer.split("/").slice(1).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
    const lastKey = segments.pop();
    if (lastKey === void 0) continue;
    let parent = root;
    for (const segment of segments) {
      if (parent === null || typeof parent !== "object") {
        parent = null;
        break;
      }
      parent = parent[segment];
    }
    if (parent === null || typeof parent !== "object") continue;
    if (Array.isArray(parent)) {
      const index2 = Number(lastKey);
      if (Number.isInteger(index2) && index2 >= 0 && index2 < parent.length) parent.splice(index2, 1);
    } else {
      delete parent[lastKey];
    }
  }
}
function normalizeContent(text, jsonNormalize, ignorePaths) {
  if (!jsonNormalize) return text;
  try {
    const parsed = JSON.parse(text);
    for (const path5 of ignorePaths) {
      try {
        stripJsonPath(parsed, path5);
      } catch (err) {
        logger4.warn("watch-service", "Skipping invalid ignore path", {
          path: path5,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }
    return stableStringify(parsed);
  } catch {
    return text;
  }
}
function validateIgnorePaths(paths) {
  for (const path5 of paths) {
    try {
      JSONPath({ path: path5, json: {}, resultType: "pointer", eval: false });
    } catch (err) {
      throw new Error(`Invalid JSONPath expression "${path5}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
function appendCacheBuster(url) {
  const value = crypto.randomBytes(4).toString("hex");
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${value}`;
}
function clearWatchTimer(id) {
  const t = timers.get(id);
  if (t) {
    clearInterval(t);
    timers.delete(id);
  }
}
function scheduleWatch(watch) {
  clearWatchTimer(watch.id);
  if (!watch.enabled) return;
  const ms = Math.max(MIN_INTERVAL_SECONDS, watch.intervalSeconds) * 1e3;
  timers.set(
    watch.id,
    setInterval(() => {
      void checkWatch(watch);
    }, ms)
  );
}
async function checkWatch(watch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const fetchUrl = watch.cacheBust ? appendCacheBuster(watch.url) : watch.url;
    const res = await fetch(fetchUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "cache-control": "no-cache", pragma: "no-cache" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    const text = await res.text();
    const normalized = normalizeContent(text, watch.jsonNormalize, watch.jsonNormalize ? watch.ignorePaths : []);
    const hash = crypto.createHash("sha256").update(normalized).digest("hex");
    watch.lastCheckedAt = Date.now();
    watch.lastError = null;
    if (watch.lastHash === null) {
      watch.lastHash = hash;
      watch.lastStatus = "watching";
    } else if (watch.lastHash !== hash) {
      watch.lastHash = hash;
      watch.lastChangedAt = Date.now();
      watch.lastStatus = "changed";
      const previous = lastCompared.get(watch.id);
      const diff = watch.showDiff && previous !== void 0 ? computeLineDiff(previous, normalized) : void 0;
      await showChangeAlert(
        {
          id: watch.id,
          label: watch.label || watch.url,
          url: watch.url,
          changedAt: watch.lastChangedAt,
          sound: watch.sound,
          diff
        },
        watch.sound
      );
    } else {
      watch.lastStatus = "watching";
    }
    if (watch.showDiff) lastCompared.set(watch.id, normalized);
    else lastCompared.delete(watch.id);
  } catch (err) {
    watch.lastCheckedAt = Date.now();
    watch.lastStatus = "error";
    watch.lastError = err instanceof Error ? err.message : String(err);
    logger4.warn("watch-service", "Check failed", { url: watch.url, error: watch.lastError });
  } finally {
    clearTimeout(timeout);
    await saveWatches(watches);
    broadcast();
  }
}
async function startWatchService() {
  if (started) return;
  started = true;
  watches = await loadWatches();
  for (const watch of watches) {
    scheduleWatch(watch);
    if (watch.enabled) void checkWatch(watch);
  }
  app2.on("before-quit", () => {
    for (const t of timers.values()) clearInterval(t);
    timers.clear();
  });
  logger4.info("watch-service", `Started with ${watches.length} watch(es)`);
}
async function addWatch(input) {
  const watch = {
    id: crypto.randomUUID(),
    url: input.url,
    label: input.label,
    intervalSeconds: Math.max(MIN_INTERVAL_SECONDS, input.intervalSeconds),
    sound: input.sound,
    jsonNormalize: input.jsonNormalize,
    ignorePaths: input.ignorePaths,
    cacheBust: input.cacheBust,
    showDiff: input.showDiff,
    enabled: true,
    lastHash: null,
    lastCheckedAt: null,
    lastChangedAt: null,
    lastStatus: "idle",
    lastError: null
  };
  watches.push(watch);
  await saveWatches(watches);
  scheduleWatch(watch);
  void checkWatch(watch);
  broadcast();
  return watch;
}
async function updateWatch(id, patch) {
  const watch = watches.find((w) => w.id === id);
  if (!watch) throw new Error(`Watch not found: ${id}`);
  const resetBaseline = patch.url !== watch.url || patch.jsonNormalize !== watch.jsonNormalize || JSON.stringify(patch.ignorePaths) !== JSON.stringify(watch.ignorePaths);
  watch.url = patch.url;
  watch.label = patch.label;
  watch.intervalSeconds = Math.max(MIN_INTERVAL_SECONDS, patch.intervalSeconds);
  watch.sound = patch.sound;
  watch.jsonNormalize = patch.jsonNormalize;
  watch.ignorePaths = patch.ignorePaths;
  watch.cacheBust = patch.cacheBust;
  watch.showDiff = patch.showDiff;
  if (resetBaseline) {
    watch.lastHash = null;
    watch.lastChangedAt = null;
    watch.lastStatus = "idle";
    watch.lastError = null;
    lastCompared.delete(watch.id);
  }
  await saveWatches(watches);
  scheduleWatch(watch);
  if (watch.enabled) void checkWatch(watch);
  broadcast();
  return watch;
}
async function setWatchEnabled(id, enabled) {
  const watch = watches.find((w) => w.id === id);
  if (!watch) throw new Error(`Watch not found: ${id}`);
  watch.enabled = enabled;
  await saveWatches(watches);
  scheduleWatch(watch);
  if (enabled) void checkWatch(watch);
  broadcast();
  return watch;
}
async function removeWatch(id) {
  clearWatchTimer(id);
  lastCompared.delete(id);
  watches = watches.filter((w) => w.id !== id);
  await saveWatches(watches);
  broadcast();
}
async function checkWatchNow(id) {
  const watch = watches.find((w) => w.id === id);
  if (!watch) throw new Error(`Watch not found: ${id}`);
  await checkWatch(watch);
}

// main/handlers/watches.ts
function asRecord(value) {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid arguments: expected an object");
  }
  return value;
}
function requireId(value) {
  const { id } = asRecord(value);
  if (typeof id !== "string" || id.length === 0) throw new Error("Invalid arguments: 'id' is required");
  return id;
}
function parseWatchInput(value) {
  const v = asRecord(value);
  const url = typeof v.url === "string" ? v.url.trim() : "";
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("Invalid arguments: 'url' must start with http:// or https://");
  }
  const intervalSeconds = typeof v.intervalSeconds === "number" && Number.isFinite(v.intervalSeconds) ? Math.floor(v.intervalSeconds) : 300;
  const jsonNormalize = v.jsonNormalize === true;
  const ignorePaths = Array.isArray(v.ignorePaths) ? v.ignorePaths.filter((p) => typeof p === "string" && p.trim().length > 0).map((p) => p.trim()) : [];
  if (jsonNormalize && ignorePaths.length > 0) validateIgnorePaths(ignorePaths);
  return {
    url,
    label: typeof v.label === "string" ? v.label.trim() : "",
    intervalSeconds,
    sound: coerceSoundOption(v.sound),
    jsonNormalize,
    ignorePaths,
    cacheBust: v.cacheBust === true,
    showDiff: v.showDiff === true
  };
}
function registerWatchHandlers() {
  ipcMain3.handle("watches:list", async () => getWatches());
  ipcMain3.handle("watches:add", async (_event, input) => addWatch(parseWatchInput(input)), {
    isMutation: true
  });
  ipcMain3.handle(
    "watches:update",
    async (_event, args) => {
      const id = requireId(args);
      return updateWatch(id, parseWatchInput(args));
    },
    { isMutation: true }
  );
  ipcMain3.handle(
    "watches:setEnabled",
    async (_event, args) => {
      const v = asRecord(args);
      return setWatchEnabled(requireId(args), v.enabled === true);
    },
    { isMutation: true }
  );
  ipcMain3.handle(
    "watches:remove",
    async (_event, args) => {
      await removeWatch(requireId(args));
      return { ok: true };
    },
    { isMutation: true }
  );
  ipcMain3.handle("watches:checkNow", async (_event, args) => {
    await checkWatchNow(requireId(args));
    return { ok: true };
  });
  ipcMain3.handle("alert:get", async () => getAlertPayload());
  ipcMain3.handle("alert:open", async (_event, args) => {
    await openChangedUrl(requireId(args));
    return { ok: true };
  });
  ipcMain3.handle("alert:dismiss", async () => {
    dismissAlerts();
    return { ok: true };
  });
}

// main/windows/settings-window.ts
import { BrowserWindow as BrowserWindow2, logger as logger5 } from "@glaze/core/backend";
var settingsWindow = null;
async function openSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    logger5.debug("settings", "Settings window already exists, showing it");
    settingsWindow.show();
    return;
  }
  logger5.info("settings", "Creating settings window");
  settingsWindow = new BrowserWindow2({
    windowKey: "settings",
    width: 520,
    height: 300,
    minWidth: 400,
    minHeight: 200,
    title: "Settings",
    show: false,
    center: true,
    webPreferences: {
      preload: getPreloadPath()
    }
  });
  settingsWindow.once("ready-to-show", () => {
    settingsWindow?.show();
  });
  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
  const url = await getWindowUrl("settings-window.html");
  logger5.info("settings", "Loading settings URL", { url });
  await settingsWindow.loadURL(url);
}
function getSettingsWindow() {
  return settingsWindow;
}

// main/handlers/index.ts
import { ipcMain as ipcMain4, logger as logger6 } from "@glaze/core/backend";
var __filename = fileURLToPath2(import.meta.url);
var __dirname = path3.dirname(__filename);
function registerHandlers() {
  logger6.info("handlers", "Registering IPC handlers...");
  ipcMain4.handle("app:getInfo", async (_event) => {
    return await appHandlers.getInfo();
  });
  ipcMain4.handle("app:getProjectPath", async () => {
    return path3.join(__dirname, "..", "..");
  });
  ipcMain4.handle("window:openSettings", async (_event) => {
    await openSettingsWindow();
  });
  ipcMain4.handle("window:closeSettings", async (_event) => {
    getSettingsWindow()?.close();
  });
  registerWatchHandlers();
  logger6.info("handlers", "\u2713 IPC handlers registered");
  void startWatchService();
}

// main/index.ts
var __filename2 = fileURLToPath3(import.meta.url);
var __dirname2 = path4.dirname(__filename2);
registerHandlers();
var devHarness = null;
var appAiDevHarness = null;
if (false) {
  devHarness = await null;
  devHarness.applyParityScenarioStartup();
  appAiDevHarness = await null;
}
var mainWindow = null;
async function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    logger7.debug("main", "Main window already exists, skipping creation");
    return;
  }
  const packageJsonPath = path4.join(__dirname2, "..", "..", "package.json");
  const minWindowWidth = 420;
  const minWindowHeight = 480;
  const windowWidth = 560;
  const windowHeight = 640;
  let windowTitle = "Glaze App";
  try {
    if (fs3.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(await fs3.promises.readFile(packageJsonPath, "utf-8"));
      windowTitle = packageJson.productName || packageJson.appConfig?.displayName || windowTitle;
    }
  } catch {
  }
  const browserWindowStartTime = Date.now();
  logger7.info("main", "\u23F1\uFE0F [COLD_START] Creating BrowserWindow", {
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  mainWindow = new BrowserWindow3({
    windowKey: "main",
    // Stable key for frame persistence
    width: windowWidth,
    height: windowHeight,
    minWidth: minWindowWidth,
    minHeight: minWindowHeight,
    title: windowTitle,
    show: false,
    // Don't show until WebView is ready (prevents flickering)
    webPreferences: {
      preload: getPreloadPath()
    }
  });
  const browserWindowEndTime = Date.now();
  logger7.info("main", "\u23F1\uFE0F [COLD_START] BrowserWindow constructor completed", {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    duration_ms: browserWindowEndTime - browserWindowStartTime
  });
  mainWindow.once("ready-to-show", () => {
    const showStartTime = Date.now();
    logger7.info("main", "\u23F1\uFE0F [COLD_START] ready-to-show event received, showing window", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    mainWindow?.show();
    const showEndTime = Date.now();
    logger7.info("main", "\u23F1\uFE0F [COLD_START] Window shown", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      duration_ms: showEndTime - showStartTime
    });
  });
  const url = await getWindowUrl("main-window.html");
  logger7.info("main", "Resolved main window URL", { url });
  const loadURLStartTime = Date.now();
  logger7.info("main", "\u23F1\uFE0F [COLD_START] Loading URL in window", {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    url
  });
  await mainWindow.loadURL(url);
  const loadURLEndTime = Date.now();
  logger7.info("main", "\u23F1\uFE0F [COLD_START] URL loaded in window (waiting for ready-to-show)", {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    duration_ms: loadURLEndTime - loadURLStartTime
  });
}
async function setupApplicationMenu() {
  await initDevToolsButtonState();
  const menu = Menu.buildFromTemplate([
    {
      label: "App",
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Settings\u2026",
          icon: "gearshape",
          accelerator: "Command+,",
          click: async () => await openSettingsWindow()
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    { role: "fileMenu" },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" }
  ]);
  Menu.setApplicationMenu(menu);
  logger7.info("main", "Application menu configured with Settings");
}
app3.on("window-all-closed", () => {
});
app3.on("activate", (hasVisibleWindows) => {
  logger7.info("main", "App activate event received", {
    hasVisibleWindows,
    mainWindowExists: !!mainWindow,
    mainWindowDestroyed: mainWindow?.isDestroyed() ?? true
  });
  if (!hasVisibleWindows) {
    if (!mainWindow || mainWindow.isDestroyed()) {
      logger7.info("main", "Creating main window due to activate event");
      createMainWindow();
    } else {
      logger7.info("main", "Showing existing main window");
      mainWindow.show();
    }
  } else {
    logger7.info("main", "Has visible windows, no action needed");
  }
});
app3.on("before-quit", () => {
  logger7.info("main", "App before-quit, cleaning up...");
});
var startTime = Date.now();
logger7.info("main", "\u23F1\uFE0F [COLD_START] Waiting for app ready...", {
  timestamp: (/* @__PURE__ */ new Date()).toISOString()
});
app3.whenReady().then(async () => {
  const windowCreateStartTime = Date.now();
  logger7.info("main", "\u23F1\uFE0F [COLD_START] App ready, creating main window", {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    wait_duration_ms: windowCreateStartTime - startTime
  });
  await devHarness?.runParityAutotestIfRequested();
  await appAiDevHarness?.runAppAiAutotest();
  await setupApplicationMenu();
  createMainWindow().then(() => {
    const windowCreateEndTime = Date.now();
    logger7.info("main", "\u23F1\uFE0F [COLD_START] Main window created successfully", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      duration_ms: windowCreateEndTime - windowCreateStartTime
    });
  }).catch((error) => {
    logger7.error("main", "Failed to create main window", error);
  });
});
//# sourceMappingURL=index.js.map
