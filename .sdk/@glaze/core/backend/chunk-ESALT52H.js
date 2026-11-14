import { createRequire as __createRequire } from "module";
const require = __createRequire(import.meta.url);
import { c as Ke } from "./chunk-7SCUN4AF.js";
var Jf = "vercel.ai.error",
  oy = Symbol.for(Jf),
  pf,
  gf,
  K = class Bf extends ((gf = Error), (pf = oy), gf) {
    constructor({ name: t, message: n, cause: o }) {
      (super(n), (this[pf] = !0), (this.name = t), (this.cause = o));
    }
    static isInstance(t) {
      return Bf.hasMarker(t, Jf);
    }
    static hasMarker(t, n) {
      let o = Symbol.for(n);
      return (
        t != null &&
        typeof t == "object" &&
        o in t &&
        typeof t[o] == "boolean" &&
        t[o] === !0
      );
    }
  },
  Kf = "AI_APICallError",
  Wf = `vercel.ai.error.${Kf}`,
  ay = Symbol.for(Wf),
  vf,
  hf,
  oe = class extends ((hf = K), (vf = ay), hf) {
    constructor({
      message: e,
      url: t,
      requestBodyValues: n,
      statusCode: o,
      responseHeaders: r,
      responseBody: i,
      cause: a,
      isRetryable: s = o != null &&
        (o === 408 || o === 409 || o === 429 || o >= 500),
      data: c,
    }) {
      (super({ name: Kf, message: e, cause: a }),
        (this[vf] = !0),
        (this.url = t),
        (this.requestBodyValues = n),
        (this.statusCode = o),
        (this.responseHeaders = r),
        (this.responseBody = i),
        (this.isRetryable = s),
        (this.data = c));
    }
    static isInstance(e) {
      return K.hasMarker(e, Wf);
    }
  },
  Gf = "AI_EmptyResponseBodyError",
  qf = `vercel.ai.error.${Gf}`,
  sy = Symbol.for(qf),
  yf,
  $f,
  Xf = class extends (($f = K), (yf = sy), $f) {
    constructor({ message: e = "Empty response body" } = {}) {
      (super({ name: Gf, message: e }), (this[yf] = !0));
    }
    static isInstance(e) {
      return K.hasMarker(e, qf);
    }
  };
function ci(e) {
  return e == null
    ? "unknown error"
    : typeof e == "string"
      ? e
      : e instanceof Error
        ? e.toString()
        : JSON.stringify(e);
}
var Hf = "AI_InvalidArgumentError",
  Yf = `vercel.ai.error.${Hf}`,
  uy = Symbol.for(Yf),
  _f,
  bf,
  li = class extends ((bf = K), (_f = uy), bf) {
    constructor({ message: e, cause: t, argument: n }) {
      (super({ name: Hf, message: e, cause: t }),
        (this[_f] = !0),
        (this.argument = n));
    }
    static isInstance(e) {
      return K.hasMarker(e, Yf);
    }
  },
  Qf = "AI_InvalidPromptError",
  em = `vercel.ai.error.${Qf}`,
  cy = Symbol.for(em),
  xf,
  kf,
  fI = class extends ((kf = K), (xf = cy), kf) {
    constructor({ prompt: e, message: t, cause: n }) {
      (super({ name: Qf, message: `Invalid prompt: ${t}`, cause: n }),
        (this[xf] = !0),
        (this.prompt = e));
    }
    static isInstance(e) {
      return K.hasMarker(e, em);
    }
  },
  tm = "AI_InvalidResponseDataError",
  rm = `vercel.ai.error.${tm}`,
  ly = Symbol.for(rm),
  wf,
  If,
  mI = class extends ((If = K), (wf = ly), If) {
    constructor({
      data: e,
      message: t = `Invalid response data: ${JSON.stringify(e)}.`,
    }) {
      (super({ name: tm, message: t }), (this[wf] = !0), (this.data = e));
    }
    static isInstance(e) {
      return K.hasMarker(e, rm);
    }
  },
  nm = "AI_JSONParseError",
  im = `vercel.ai.error.${nm}`,
  dy = Symbol.for(im),
  Sf,
  zf,
  Jr = class extends ((zf = K), (Sf = dy), zf) {
    constructor({ text: e, cause: t }) {
      (super({
        name: nm,
        message: `JSON parsing failed: Text: ${e}.
Error message: ${ci(t)}`,
        cause: t,
      }),
        (this[Sf] = !0),
        (this.text = e));
    }
    static isInstance(e) {
      return K.hasMarker(e, im);
    }
  },
  om = "AI_LoadAPIKeyError",
  am = `vercel.ai.error.${om}`,
  fy = Symbol.for(am),
  Pf,
  Of,
  Br = class extends ((Of = K), (Pf = fy), Of) {
    constructor({ message: e }) {
      (super({ name: om, message: e }), (this[Pf] = !0));
    }
    static isInstance(e) {
      return K.hasMarker(e, am);
    }
  },
  sm = "AI_LoadSettingError",
  um = `vercel.ai.error.${sm}`,
  my = Symbol.for(um),
  jf,
  Nf,
  pI = class extends ((Nf = K), (jf = my), Nf) {
    constructor({ message: e }) {
      (super({ name: sm, message: e }), (this[jf] = !0));
    }
    static isInstance(e) {
      return K.hasMarker(e, um);
    }
  },
  cm = "AI_NoContentGeneratedError",
  lm = `vercel.ai.error.${cm}`,
  py = Symbol.for(lm),
  Tf,
  Af,
  gI = class extends ((Af = K), (Tf = py), Af) {
    constructor({ message: e = "No content generated." } = {}) {
      (super({ name: cm, message: e }), (this[Tf] = !0));
    }
    static isInstance(e) {
      return K.hasMarker(e, lm);
    }
  },
  dm = "AI_NoSuchModelError",
  fm = `vercel.ai.error.${dm}`,
  gy = Symbol.for(fm),
  Df,
  Uf,
  vI = class extends ((Uf = K), (Df = gy), Uf) {
    constructor({
      errorName: e = dm,
      modelId: t,
      modelType: n,
      message: o = `No such ${n}: ${t}`,
    }) {
      (super({ name: e, message: o }),
        (this[Df] = !0),
        (this.modelId = t),
        (this.modelType = n));
    }
    static isInstance(e) {
      return K.hasMarker(e, fm);
    }
  },
  mm = "AI_NoSuchProviderReferenceError",
  pm = `vercel.ai.error.${mm}`,
  vy = Symbol.for(pm),
  Ef,
  Zf,
  gm = class extends ((Zf = K), (Ef = vy), Zf) {
    constructor({
      provider: e,
      reference: t,
      message:
        n = `No provider reference found for provider '${e}'. Available providers: ${Object.keys(t).join(", ")}`,
    }) {
      (super({ name: mm, message: n }),
        (this[Ef] = !0),
        (this.provider = e),
        (this.reference = t));
    }
    static isInstance(e) {
      return K.hasMarker(e, pm);
    }
  },
  vm = "AI_TooManyEmbeddingValuesForCallError",
  hm = `vercel.ai.error.${vm}`,
  hy = Symbol.for(hm),
  Cf,
  Lf,
  hI = class extends ((Lf = K), (Cf = hy), Lf) {
    constructor(e) {
      (super({
        name: vm,
        message: `Too many values for a single embedding call. The ${e.provider} model "${e.modelId}" can only embed up to ${e.maxEmbeddingsPerCall} values per call, but ${e.values.length} values were provided.`,
      }),
        (this[Cf] = !0),
        (this.provider = e.provider),
        (this.modelId = e.modelId),
        (this.maxEmbeddingsPerCall = e.maxEmbeddingsPerCall),
        (this.values = e.values));
    }
    static isInstance(e) {
      return K.hasMarker(e, hm);
    }
  },
  ym = "AI_TypeValidationError",
  $m = `vercel.ai.error.${ym}`,
  yy = Symbol.for($m),
  Rf,
  Vf,
  rt = class wa extends ((Vf = K), (Rf = yy), Vf) {
    constructor({ value: t, cause: n, context: o }) {
      let r = "Type validation failed";
      if (
        (o?.field && (r += ` for ${o.field}`), o?.entityName || o?.entityId)
      ) {
        r += " (";
        let i = [];
        (o.entityName && i.push(o.entityName),
          o.entityId && i.push(`id: "${o.entityId}"`),
          (r += i.join(", ")),
          (r += ")"));
      }
      (super({
        name: ym,
        message: `${r}: Value: ${JSON.stringify(t)}.
Error message: ${ci(n)}`,
        cause: n,
      }),
        (this[Rf] = !0),
        (this.value = t),
        (this.context = o));
    }
    static isInstance(t) {
      return K.hasMarker(t, $m);
    }
    static wrap({ value: t, cause: n, context: o }) {
      var r, i, a;
      return wa.isInstance(n) &&
        n.value === t &&
        ((r = n.context) == null ? void 0 : r.field) === o?.field &&
        ((i = n.context) == null ? void 0 : i.entityName) === o?.entityName &&
        ((a = n.context) == null ? void 0 : a.entityId) === o?.entityId
        ? n
        : new wa({ value: t, cause: n, context: o });
    }
  },
  _m = "AI_UnsupportedFunctionalityError",
  bm = `vercel.ai.error.${_m}`,
  $y = Symbol.for(bm),
  Ff,
  Mf,
  Ia = class extends ((Mf = K), (Ff = $y), Mf) {
    constructor({
      functionality: e,
      message: t = `'${e}' functionality not supported.`,
    }) {
      (super({ name: _m, message: t }),
        (this[Ff] = !0),
        (this.functionality = e));
    }
    static isInstance(e) {
      return K.hasMarker(e, bm);
    }
  };
function ui(e) {
  return e === null ||
    typeof e == "string" ||
    typeof e == "number" ||
    typeof e == "boolean"
    ? !0
    : Array.isArray(e)
      ? e.every(ui)
      : typeof e == "object"
        ? Object.entries(e).every(
            ([t, n]) => typeof t == "string" && (n === void 0 || ui(n)),
          )
        : !1;
}
function yI(e) {
  return Array.isArray(e) && e.every(ui);
}
function $I(e) {
  return (
    e != null &&
    typeof e == "object" &&
    Object.entries(e).every(
      ([t, n]) => typeof t == "string" && (n === void 0 || ui(n)),
    )
  );
}
var _h = {};
Ke(_h, {
  $brand: () => La,
  $input: () => dc,
  $output: () => lc,
  INVALID: () => me,
  NEVER: () => Ca,
  TimePrecision: () => kc,
  ZodAny: () => cd,
  ZodArray: () => md,
  ZodBase64: () => aa,
  ZodBase64URL: () => sa,
  ZodBigInt: () => Sr,
  ZodBigIntFormat: () => la,
  ZodBoolean: () => Ir,
  ZodCIDRv4: () => ia,
  ZodCIDRv6: () => oa,
  ZodCUID: () => Ho,
  ZodCUID2: () => Yo,
  ZodCatch: () => Dd,
  ZodCodec: () => Fn,
  ZodCompileAsyncError: () => De,
  ZodCompileUnsupportedError: () => M,
  ZodCreditCard: () => td,
  ZodCustom: () => Mn,
  ZodCustomStringFormat: () => Ut,
  ZodDate: () => En,
  ZodDefault: () => Pd,
  ZodDiscriminatedUnion: () => gd,
  ZodE164: () => ua,
  ZodEmail: () => Wo,
  ZodEmoji: () => qo,
  ZodEnum: () => xr,
  ZodError: () => Cx,
  ZodExactOptional: () => pa,
  ZodFile: () => wd,
  ZodFirstPartyTypeKind: () => Gd,
  ZodFunction: () => Jd,
  ZodGUID: () => Go,
  ZodIBAN: () => rd,
  ZodIPv4: () => ra,
  ZodIPv6: () => na,
  ZodISODate: () => mt,
  ZodISODateTime: () => ft,
  ZodISODuration: () => gt,
  ZodISOTime: () => pt,
  ZodInstanceOf: () => Wd,
  ZodIntersection: () => vd,
  ZodIssueCode: () => Vx,
  ZodJWT: () => ca,
  ZodKSUID: () => ta,
  ZodLazy: () => Vd,
  ZodLiteral: () => kd,
  ZodMAC: () => ed,
  ZodMap: () => bd,
  ZodNaN: () => Ed,
  ZodNanoID: () => Xo,
  ZodNever: () => dd,
  ZodNonOptional: () => ga,
  ZodNull: () => sd,
  ZodNullable: () => zd,
  ZodNumber: () => wr,
  ZodNumberFormat: () => Et,
  ZodObject: () => Cn,
  ZodOptional: () => Rn,
  ZodPipe: () => Vn,
  ZodPrefault: () => jd,
  ZodPreprocess: () => Zd,
  ZodPromise: () => Md,
  ZodReadonly: () => Cd,
  ZodRealError: () => xe,
  ZodRecord: () => br,
  ZodSet: () => xd,
  ZodString: () => kr,
  ZodStringFormat: () => X,
  ZodSuccess: () => Ad,
  ZodSymbol: () => od,
  ZodTemplateLiteral: () => Rd,
  ZodTransform: () => Id,
  ZodTuple: () => yd,
  ZodType: () => L,
  ZodULID: () => Qo,
  ZodURL: () => Un,
  ZodUUID: () => Me,
  ZodUndefined: () => ad,
  ZodUnion: () => Ln,
  ZodUnknown: () => ld,
  ZodVoid: () => fd,
  ZodXID: () => ea,
  ZodXor: () => pd,
  _ZodString: () => Ko,
  _default: () => Od,
  _function: () => th,
  any: () => Tv,
  array: () => Zn,
  base64: () => fv,
  base64url: () => mv,
  bigint: () => zv,
  boolean: () => id,
  catch: () => Ud,
  check: () => rh,
  cidrv4: () => lv,
  cidrv6: () => dv,
  clone: () => W,
  codec: () => Hv,
  coerce: () => Xd,
  compile: () => gc,
  config: () => te,
  core: () => He,
  creditCard: () => gv,
  cuid: () => rv,
  cuid2: () => nv,
  currencyCode: () => bv,
  custom: () => nh,
  date: () => Dv,
  decode: () => Wl,
  decodeAsync: () => ql,
  deepPartial: () => vh,
  describe: () => ih,
  discriminatedUnion: () => Rv,
  e164: () => pv,
  email: () => Kg,
  emoji: () => ev,
  encode: () => Kl,
  encodeAsync: () => Gl,
  endsWith: () => cr,
  enum: () => fa,
  exactOptional: () => Sd,
  file: () => Wv,
  flattenError: () => rn,
  float32: () => kv,
  float64: () => wv,
  formatError: () => nn,
  fromJSONSchema: () => ph,
  function: () => th,
  getDiscriminatedOption: () => Cu,
  getErrorMap: () => Mx,
  globalRegistry: () => ue,
  gt: () => Ve,
  gte: () => we,
  guid: () => Wg,
  hash: () => xv,
  hex: () => _v,
  hostname: () => $v,
  httpUrl: () => Qg,
  iban: () => vv,
  includes: () => sr,
  input: () => yh,
  instanceof: () => ah,
  int: () => Jo,
  int32: () => Iv,
  int64: () => Pv,
  intersection: () => hd,
  invertCodec: () => Yv,
  ipv4: () => sv,
  ipv6: () => cv,
  iso: () => Jn,
  json: () => uh,
  jwt: () => hv,
  keyof: () => Uv,
  ksuid: () => av,
  lazy: () => Fd,
  length: () => jt,
  literal: () => Kv,
  locales: () => wn,
  looseObject: () => Cv,
  looseRecord: () => Fv,
  lowercase: () => or,
  lt: () => Re,
  lte: () => ke,
  mac: () => uv,
  map: () => Mv,
  maxLength: () => Ot,
  maxSize: () => ut,
  memoizer: () => xn,
  meta: () => oh,
  mime: () => dr,
  minLength: () => Xe,
  minSize: () => Fe,
  multipleOf: () => st,
  nan: () => Xv,
  nanoid: () => tv,
  nativeEnum: () => Bv,
  negative: () => Do,
  never: () => da,
  nonnegative: () => Eo,
  nonoptional: () => Td,
  nonpositive: () => Uo,
  normalize: () => fr,
  null: () => ud,
  nullable: () => Dn,
  nullish: () => Gv,
  number: () => nd,
  object: () => Ev,
  optional: () => At,
  output: () => $h,
  overwrite: () => Ue,
  parse: () => Ml,
  parseAsync: () => Jl,
  partialRecord: () => Vv,
  pipe: () => Bo,
  positive: () => Ao,
  prefault: () => Nd,
  preprocess: () => ch,
  prettifyError: () => Ja,
  promise: () => eh,
  properties: () => lr,
  property: () => Zo,
  readonly: () => Ld,
  record: () => _d,
  refine: () => Bd,
  regex: () => ir,
  regexes: () => Ne,
  registry: () => so,
  safeDecode: () => Hl,
  safeDecodeAsync: () => Ql,
  safeEncode: () => Xl,
  safeEncodeAsync: () => Yl,
  safeParse: () => Bl,
  safeParseAsync: () => Tn,
  set: () => Jv,
  setErrorMap: () => Fx,
  size: () => Pt,
  slugify: () => vr,
  startsWith: () => ur,
  strictObject: () => Zv,
  string: () => An,
  stringFormat: () => yv,
  stringbool: () => sh,
  success: () => qv,
  superRefine: () => Kd,
  symbol: () => jv,
  templateLiteral: () => Qv,
  toJSONSchema: () => _r,
  toLowerCase: () => pr,
  toUpperCase: () => gr,
  toZod: () => Kr,
  transform: () => ma,
  treeifyError: () => Ma,
  trim: () => mr,
  tuple: () => $d,
  uint32: () => Sv,
  uint64: () => Ov,
  ulid: () => iv,
  undefined: () => Nv,
  union: () => zr,
  unknown: () => Tt,
  uppercase: () => ar,
  url: () => Yg,
  util: () => h,
  uuid: () => Gg,
  uuidv4: () => qg,
  uuidv6: () => Xg,
  uuidv7: () => Hg,
  validate: () => on,
  validateAsync: () => an,
  void: () => Av,
  withParser: () => uo,
  xid: () => ov,
  xor: () => Lv,
});
var He = {};
Ke(He, {
  $ZodAny: () => Ou,
  $ZodArray: () => Uu,
  $ZodAsyncError: () => _e,
  $ZodBase64: () => hu,
  $ZodBase64URL: () => yu,
  $ZodBigInt: () => Wi,
  $ZodBigIntFormat: () => Iu,
  $ZodBoolean: () => vn,
  $ZodCIDRv4: () => gu,
  $ZodCIDRv6: () => vu,
  $ZodCUID: () => nu,
  $ZodCUID2: () => iu,
  $ZodCatch: () => ec,
  $ZodCheck: () => Y,
  $ZodCheckBigIntFormat: () => js,
  $ZodCheckEndsWith: () => Fs,
  $ZodCheckGreaterThan: () => Ni,
  $ZodCheckIncludes: () => Rs,
  $ZodCheckLengthEquals: () => Es,
  $ZodCheckLessThan: () => ji,
  $ZodCheckLowerCase: () => Cs,
  $ZodCheckMaxLength: () => Ds,
  $ZodCheckMaxSize: () => Ns,
  $ZodCheckMimeType: () => Bs,
  $ZodCheckMinLength: () => Us,
  $ZodCheckMinSize: () => Ts,
  $ZodCheckMultipleOf: () => Ps,
  $ZodCheckNumberFormat: () => Os,
  $ZodCheckOverwrite: () => Ks,
  $ZodCheckProperties: () => Js,
  $ZodCheckProperty: () => Ms,
  $ZodCheckRegex: () => Zs,
  $ZodCheckSizeEquals: () => As,
  $ZodCheckStartsWith: () => Vs,
  $ZodCheckStringFormat: () => Qt,
  $ZodCheckUpperCase: () => Ls,
  $ZodCodec: () => yn,
  $ZodCreditCard: () => _u,
  $ZodCustom: () => sc,
  $ZodCustomStringFormat: () => ku,
  $ZodCyclicError: () => eo,
  $ZodDate: () => Au,
  $ZodDefault: () => Xu,
  $ZodDiscriminatedUnion: () => Lu,
  $ZodE164: () => $u,
  $ZodEmail: () => Hs,
  $ZodEmoji: () => tu,
  $ZodEncodeError: () => ot,
  $ZodEnum: () => Ju,
  $ZodError: () => Fa,
  $ZodExactOptional: () => Gu,
  $ZodFile: () => Ku,
  $ZodFunction: () => oc,
  $ZodGUID: () => qs,
  $ZodIBAN: () => bu,
  $ZodIPv4: () => fu,
  $ZodIPv6: () => mu,
  $ZodISODate: () => cu,
  $ZodISODateTime: () => uu,
  $ZodISODuration: () => du,
  $ZodISOTime: () => lu,
  $ZodIntersection: () => Ru,
  $ZodJWT: () => xu,
  $ZodKSUID: () => su,
  $ZodLazy: () => $n,
  $ZodLiteral: () => Bu,
  $ZodMAC: () => pu,
  $ZodMap: () => Fu,
  $ZodNaN: () => tc,
  $ZodNanoID: () => ru,
  $ZodNever: () => Nu,
  $ZodNonOptional: () => Yu,
  $ZodNull: () => Pu,
  $ZodNullable: () => qu,
  $ZodNumber: () => Ki,
  $ZodNumberFormat: () => wu,
  $ZodObject: () => rp,
  $ZodObjectJIT: () => Eu,
  $ZodOptional: () => qi,
  $ZodPipe: () => Xi,
  $ZodPrefault: () => Hu,
  $ZodPreprocess: () => rc,
  $ZodPromise: () => ac,
  $ZodReadonly: () => nc,
  $ZodRealError: () => be,
  $ZodRecord: () => Vu,
  $ZodRegistry: () => ao,
  $ZodSet: () => Mu,
  $ZodString: () => wt,
  $ZodStringFormat: () => G,
  $ZodSuccess: () => Qu,
  $ZodSymbol: () => Su,
  $ZodTemplateLiteral: () => ic,
  $ZodTransform: () => Wu,
  $ZodTuple: () => Gi,
  $ZodType: () => C,
  $ZodULID: () => ou,
  $ZodURL: () => eu,
  $ZodUUID: () => Xs,
  $ZodUndefined: () => zu,
  $ZodUnion: () => hn,
  $ZodUnknown: () => ju,
  $ZodVoid: () => Tu,
  $ZodXID: () => au,
  $ZodXor: () => Zu,
  $brand: () => La,
  $constructor: () => p,
  $input: () => dc,
  $output: () => lc,
  Doc: () => kt,
  INVALID: () => me,
  JSONSchema: () => Mg,
  JSONSchemaGenerator: () => Vo,
  NEVER: () => Ca,
  TimePrecision: () => kc,
  URL_BAD_FORMAT: () => Ys,
  URL_UNPARSEABLE: () => dn,
  ZodCompileAsyncError: () => De,
  ZodCompileUnsupportedError: () => M,
  _any: () => Rc,
  _array: () => Wc,
  _base64: () => Oo,
  _base64url: () => jo,
  _bigint: () => Ac,
  _boolean: () => Nc,
  _catch: () => Sx,
  _check: () => zg,
  _cidrv4: () => zo,
  _cidrv6: () => Po,
  _coercedBigint: () => Dc,
  _coercedBoolean: () => Tc,
  _coercedDate: () => Bc,
  _coercedNumber: () => Ic,
  _coercedString: () => $c,
  _creditCard: () => bc,
  _cuid: () => _o,
  _cuid2: () => bo,
  _custom: () => qc,
  _date: () => Jc,
  _decode: () => $i,
  _decodeAsync: () => bi,
  _default: () => kx,
  _discriminatedUnion: () => dx,
  _e164: () => No,
  _email: () => fo,
  _emoji: () => yo,
  _encode: () => yi,
  _encodeAsync: () => _i,
  _endsWith: () => cr,
  _enum: () => hx,
  _file: () => Gc,
  _float32: () => zc,
  _float64: () => Pc,
  _gt: () => Ve,
  _gte: () => we,
  _guid: () => mo,
  _iban: () => xc,
  _includes: () => sr,
  _int: () => Sc,
  _int32: () => Oc,
  _int64: () => Uc,
  _intersection: () => fx,
  _ipv4: () => Io,
  _ipv6: () => So,
  _isoDate: () => zn,
  _isoDateTime: () => Sn,
  _isoDuration: () => On,
  _isoTime: () => Pn,
  _jwt: () => To,
  _ksuid: () => wo,
  _lazy: () => jx,
  _length: () => jt,
  _literal: () => $x,
  _lowercase: () => or,
  _lt: () => Re,
  _lte: () => ke,
  _mac: () => _c,
  _map: () => gx,
  _max: () => ke,
  _maxLength: () => Ot,
  _maxSize: () => ut,
  _mime: () => dr,
  _min: () => we,
  _minLength: () => Xe,
  _minSize: () => Fe,
  _multipleOf: () => st,
  _nan: () => Kc,
  _nanoid: () => $o,
  _nativeEnum: () => yx,
  _negative: () => Do,
  _never: () => Fc,
  _nonnegative: () => Eo,
  _nonoptional: () => wx,
  _nonpositive: () => Uo,
  _normalize: () => fr,
  _null: () => Lc,
  _nullable: () => xx,
  _number: () => wc,
  _optional: () => bx,
  _overwrite: () => Ue,
  _parse: () => qt,
  _parseAsync: () => Xt,
  _pipe: () => zx,
  _positive: () => Ao,
  _promise: () => Nx,
  _properties: () => lr,
  _property: () => Zo,
  _readonly: () => Px,
  _record: () => px,
  _refine: () => Xc,
  _regex: () => ir,
  _safeDecode: () => ki,
  _safeDecodeAsync: () => Ii,
  _safeEncode: () => xi,
  _safeEncodeAsync: () => wi,
  _safeParse: () => Ht,
  _safeParseAsync: () => Yt,
  _set: () => vx,
  _size: () => Pt,
  _slugify: () => vr,
  _startsWith: () => ur,
  _string: () => yc,
  _stringFormat: () => Nt,
  _stringbool: () => el,
  _success: () => Ix,
  _superRefine: () => Hc,
  _symbol: () => Zc,
  _templateLiteral: () => Ox,
  _toLowerCase: () => pr,
  _toUpperCase: () => gr,
  _transform: () => _x,
  _trim: () => mr,
  _tuple: () => mx,
  _uint32: () => jc,
  _uint64: () => Ec,
  _ulid: () => xo,
  _undefined: () => Cc,
  _union: () => cx,
  _unknown: () => Vc,
  _uppercase: () => ar,
  _url: () => In,
  _uuid: () => po,
  _uuidv4: () => go,
  _uuidv6: () => vo,
  _uuidv7: () => ho,
  _void: () => Mc,
  _xid: () => ko,
  _xor: () => lx,
  base64Charset: () => Vi,
  base64urlCharset: () => gn,
  canParseURL: () => Qs,
  clone: () => W,
  compile: () => gc,
  compileFn: () => co,
  config: () => te,
  createStandardJSONSchemaMethod: () => hr,
  createToJSONSchemaMethod: () => rl,
  decode: () => l$,
  decodeAsync: () => f$,
  describe: () => Yc,
  encode: () => c$,
  encodeAsync: () => d$,
  extractDefs: () => lt,
  finalize: () => dt,
  flattenError: () => rn,
  formatError: () => nn,
  getDiscriminatedOption: () => Cu,
  globalConfig: () => ae,
  globalRegistry: () => ue,
  handleUnrepresentable: () => ne,
  initializeContext: () => ct,
  isBackEdge: () => ro,
  isRecursiveSchema: () => to,
  isValidBase64: () => pn,
  isValidBase64URL: () => Fi,
  isValidCIDRv6: () => Ri,
  isValidCreditCard: () => Mi,
  isValidIBAN: () => Ji,
  isValidIPv6: () => mn,
  isValidJWT: () => Bi,
  locales: () => wn,
  memoizer: () => xn,
  mergeValues: () => er,
  meta: () => Qc,
  parse: () => vi,
  parseAsync: () => hi,
  parseURLObject: () => Qm,
  prettifyError: () => Ja,
  process: () => q,
  processSchema: () => q,
  regexes: () => Ne,
  registry: () => so,
  safeDecode: () => p$,
  safeDecodeAsync: () => v$,
  safeEncode: () => m$,
  safeEncodeAsync: () => g$,
  safeParse: () => i$,
  safeParseAsync: () => o$,
  standardProps: () => Ei,
  stripTabAndNewline: () => fn,
  toDotPath: () => Tm,
  toJSONSchema: () => _r,
  toZod: () => Kr,
  treeifyError: () => Ma,
  urlHostnameOk: () => Ci,
  urlProtocolOk: () => Li,
  util: () => h,
  validate: () => on,
  validateAsync: () => an,
  validateURL: () => Zi,
  version: () => Ws,
  withParser: () => uo,
});
var h = {};
Ke(h, {
  BIGINT_FORMAT_RANGES: () => Hr,
  CONSTANT_CATCH: () => pi,
  Class: () => Pa,
  NUMBER_FORMAT_RANGES: () => Xr,
  aborted: () => fe,
  allowsEval: () => Na,
  assert: () => wy,
  assertEqual: () => _y,
  assertIs: () => xy,
  assertNever: () => ky,
  assertNotEqual: () => by,
  assignProp: () => se,
  attachSchema: () => Yr,
  base64ToUint8Array: () => Sm,
  base64urlToUint8Array: () => My,
  cached: () => Bt,
  captureStackTrace: () => fi,
  cleanEnum: () => Fy,
  cleanRegex: () => Ge,
  clone: () => W,
  cloneDef: () => zy,
  codePointLength: () => bt,
  constantCatch: () => Ea,
  createTransparentProxy: () => Ay,
  defineLazy: () => Oa,
  defineLazyInternal: () => V,
  derived: () => Wy,
  esc: () => de,
  escapeRegex: () => je,
  explicitlyAborted: () => Da,
  extend: () => Ey,
  finalizeIssue: () => $e,
  floatSafeRemainder: () => Wr,
  getElementAtPath: () => Py,
  getEnumValues: () => Mt,
  getLengthableOrigin: () => en,
  getParsedType: () => Ty,
  getSizableOrigin: () => Qr,
  hexToUint8Array: () => By,
  hide: () => tn,
  installLazyProp: () => Hy,
  isObject: () => _t,
  isPlainObject: () => Oe,
  issue: () => Gt,
  joinValues: () => g,
  jsonStringifyReplacer: () => Jt,
  members: () => Ua,
  merge: () => Cy,
  mergeDefs: () => Ae,
  normalizeParams: () => k,
  nullish: () => di,
  numKeys: () => Ny,
  objectClone: () => Iy,
  omit: () => Uy,
  optionalKeys: () => Aa,
  own: () => it,
  parsedType: () => $,
  partial: () => Ly,
  pick: () => Dy,
  prefixIssues: () => ye,
  primitiveTypes: () => Ta,
  promiseAllObject: () => Oy,
  propertyKeyTypes: () => qr,
  randomString: () => jy,
  rawShape: () => Kt,
  required: () => Ry,
  safeExtend: () => Zy,
  shallowClone: () => Gr,
  sizeCaps: () => Wt,
  slugify: () => ja,
  stringifyPrimitive: () => y,
  toZod: () => Kr,
  uint8ArrayToBase64: () => zm,
  uint8ArrayToBase64url: () => Jy,
  uint8ArrayToHex: () => Ky,
  unwrapMessage: () => Ft,
});
function _y(e) {
  return e;
}
function by(e) {
  return e;
}
function Kr() {
  return (e) => e;
}
function xy(e) {}
function ky(e) {
  throw new Error("Unexpected value in exhaustive check");
}
function wy(e) {}
function Mt(e) {
  let t = Object.values(e).filter((o) => typeof o == "number");
  return Object.entries(e)
    .filter(([o, r]) => t.indexOf(+o) === -1)
    .map(([o, r]) => r);
}
function g(e, t = "|") {
  return e.map((n) => y(n)).join(t);
}
function Jt(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
var za = class {
  constructor(t) {
    ((this._getter = t), (this._value = void 0));
  }
  get value() {
    let t = this._getter;
    return (
      t !== void 0 && ((this._value = t()), (this._getter = void 0)),
      this._value
    );
  }
};
function Bt(e) {
  return new za(e);
}
function di(e) {
  return e == null;
}
function Ge(e) {
  let t = e.startsWith("^") ? 1 : 0,
    n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
function Wr(e, t) {
  let n = e / t,
    o = Math.round(n),
    r = 4 * Number.EPSILON * Math.max(Math.abs(n), 1);
  return Math.abs(n - o) < r ? 0 : n - o;
}
var xm = Symbol("evaluating");
function Oa(e, t, n) {
  let o;
  Object.defineProperty(e, t, {
    get() {
      if (o !== xm) return (o === void 0 && ((o = xm), (o = n())), o);
    },
    set(r) {
      Object.defineProperty(e, t, { value: r });
    },
    configurable: !0,
  });
}
function Iy(e) {
  return Object.create(
    Object.getPrototypeOf(e),
    Object.getOwnPropertyDescriptors(e),
  );
}
function se(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0,
  });
}
function Kt(e) {
  let t = Object.getOwnPropertyDescriptor(e, "shape");
  return t?.get ? t.get.raw : t?.value;
}
function We(e) {
  return Kt(e._zod.def) ?? e._zod.def.shape;
}
function km(e, t, n) {
  Object.defineProperty(e, t, {
    get() {
      let o = n();
      return (se(this, t, o), o);
    },
    enumerable: !0,
    configurable: !0,
  });
}
function wm(e, t, n) {
  t in e ? se(e, t, n) : (e[t] = n);
}
function $t(e, t, n, o) {
  let r = We(t);
  for (let i of n) {
    let a = Object.getOwnPropertyDescriptor(r, i);
    a.enumerable &&
      (a.get
        ? km(e, i, () => {
            let s = t._zod.def.shape[i];
            return o ? o(s, i) : s;
          })
        : wm(e, i, o ? o(a.value, i) : a.value));
  }
}
function Sy(e, t) {
  for (let n of Reflect.ownKeys(t)) {
    let o = Object.getOwnPropertyDescriptor(t, n);
    o.enumerable && (o.get ? km(e, n, () => t[n]) : wm(e, n, o.value));
  }
}
function Ae(...e) {
  let t = {};
  for (let n of e) {
    let o = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, o);
  }
  return Object.defineProperties({}, t);
}
function zy(e) {
  return Ae(e._zod.def);
}
function Py(e, t) {
  return t ? t.reduce((n, o) => n?.[o], e) : e;
}
function Oy(e) {
  let t = Object.keys(e),
    n = t.map((o) => e[o]);
  return Promise.all(n).then((o) => {
    let r = {};
    for (let i = 0; i < t.length; i++) r[t[i]] = o[i];
    return r;
  });
}
function jy(e = 10) {
  let t = "abcdefghijklmnopqrstuvwxyz",
    n = "";
  for (let o = 0; o < e; o++) n += t[Math.floor(Math.random() * t.length)];
  return n;
}
function de(e) {
  return JSON.stringify(e);
}
function ja(e) {
  return e
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
var fi = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function _t(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
var Na = Bt(() => {
  if (
    ae.jitless ||
    (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
  )
    return !1;
  try {
    let e = Function;
    return (new e(""), !0);
  } catch {
    return !1;
  }
});
function Oe(e) {
  if (_t(e) === !1) return !1;
  let t = e.constructor;
  if (t === void 0 || typeof t != "function") return !0;
  let n = t.prototype;
  return !(
    _t(n) === !1 ||
    Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1
  );
}
function Gr(e) {
  return Oe(e)
    ? { ...e }
    : Array.isArray(e)
      ? [...e]
      : e instanceof Map
        ? new Map(e)
        : e instanceof Set
          ? new Set(e)
          : e;
}
function Ny(e) {
  let t = 0;
  for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
var Ty = (e) => {
    let t = typeof e;
    switch (t) {
      case "undefined":
        return "undefined";
      case "string":
        return "string";
      case "number":
        return Number.isNaN(e) ? "nan" : "number";
      case "boolean":
        return "boolean";
      case "function":
        return "function";
      case "bigint":
        return "bigint";
      case "symbol":
        return "symbol";
      case "object":
        return Array.isArray(e)
          ? "array"
          : e === null
            ? "null"
            : e.then &&
                typeof e.then == "function" &&
                e.catch &&
                typeof e.catch == "function"
              ? "promise"
              : typeof Map < "u" && e instanceof Map
                ? "map"
                : typeof Set < "u" && e instanceof Set
                  ? "set"
                  : typeof Date < "u" && e instanceof Date
                    ? "date"
                    : typeof File < "u" && e instanceof File
                      ? "file"
                      : "object";
      default:
        throw new Error(`Unknown data type: ${t}`);
    }
  },
  qr = new Set(["string", "number", "symbol"]),
  Ta = new Set([
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol",
    "undefined",
  ]);
function je(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function W(e, t, n) {
  let o = new e._zod.constr(t ?? e._zod.def);
  return ((!t || n?.parent) && (o._zod.parent = e), o);
}
function k(e) {
  let t = e;
  if (!t) return {};
  if (typeof t == "string") return { error: () => t };
  if (t?.message !== void 0) {
    if (t?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return (
    delete t.message,
    typeof t.error == "string" ? { ...t, error: () => t.error } : t
  );
}
function Ay(e) {
  let t;
  return new Proxy(
    {},
    {
      get(n, o, r) {
        return (t ?? (t = e()), Reflect.get(t, o, r));
      },
      set(n, o, r, i) {
        return (t ?? (t = e()), Reflect.set(t, o, r, i));
      },
      has(n, o) {
        return (t ?? (t = e()), Reflect.has(t, o));
      },
      deleteProperty(n, o) {
        return (t ?? (t = e()), Reflect.deleteProperty(t, o));
      },
      ownKeys(n) {
        return (t ?? (t = e()), Reflect.ownKeys(t));
      },
      getOwnPropertyDescriptor(n, o) {
        return (t ?? (t = e()), Reflect.getOwnPropertyDescriptor(t, o));
      },
      defineProperty(n, o, r) {
        return (t ?? (t = e()), Reflect.defineProperty(t, o, r));
      },
    },
  );
}
function y(e) {
  return typeof e == "bigint"
    ? e.toString() + "n"
    : typeof e == "string"
      ? `"${e}"`
      : `${e}`;
}
function Aa(e) {
  return Object.keys(e).filter(
    (t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional",
  );
}
var Xr = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-34028234663852886e22, 34028234663852886e22],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
  },
  Hr = {
    int64: [BigInt("-9223372036854775808"), BigInt("9223372036854775807")],
    uint64: [BigInt(0), BigInt("18446744073709551615")],
  };
function Dy(e, t) {
  let n = e._zod.def,
    o = n.checks;
  if (o && o.length > 0)
    throw new Error(
      ".pick() cannot be used on object schemas containing refinements",
    );
  let i = {};
  return ($t(i, e, mi(e, t)), W(e, Ae(n, { shape: i, checks: [] })));
}
function mi(e, t) {
  let n = We(e),
    o = [];
  for (let r of Reflect.ownKeys(t)) {
    if (!Object.getOwnPropertyDescriptor(n, r)?.enumerable)
      throw new Error(`Unrecognized key: "${String(r)}"`);
    t[r] && o.push(r);
  }
  return o;
}
function Uy(e, t) {
  let n = e._zod.def,
    o = n.checks;
  if (o && o.length > 0)
    throw new Error(
      ".omit() cannot be used on object schemas containing refinements",
    );
  let i = new Set(mi(e, t)),
    a = {};
  return (
    $t(
      a,
      e,
      Reflect.ownKeys(We(e)).filter((s) => !i.has(s)),
    ),
    W(e, Ae(n, { shape: a, checks: [] }))
  );
}
function Ey(e, t) {
  if (!Oe(t))
    throw new Error("Invalid input to extend: expected a plain object");
  let n = e._zod.def.checks;
  if (n && n.length > 0) {
    let r = We(e);
    for (let i of Reflect.ownKeys(t))
      if (Object.getOwnPropertyDescriptor(r, i) !== void 0)
        throw new Error(
          "Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.",
        );
  }
  return W(e, Ae(e._zod.def, { shape: Im(e, t) }));
}
function Im(e, t) {
  let n = {};
  return ($t(n, e, Reflect.ownKeys(We(e))), Sy(n, t), n);
}
function Zy(e, t) {
  if (!Oe(t))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  return W(e, Ae(e._zod.def, { shape: Im(e, t) }));
}
function Cy(e, t) {
  if (!t?._zod?.def)
    throw new Error(
      "Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.",
    );
  if (e._zod.def.checks?.length)
    throw new Error(
      ".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.",
    );
  let n = {};
  ($t(n, e, Reflect.ownKeys(We(e))), $t(n, t, Reflect.ownKeys(We(t))));
  let o = Ae(e._zod.def, {
    shape: n,
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: t._zod.def.checks ?? [],
  });
  return W(e, o);
}
function Ly(e, t, n, o = "partial") {
  let i = t._zod.def.checks;
  if (i && i.length > 0)
    throw new Error(
      `.${o}() cannot be used on object schemas containing refinements`,
    );
  let s = n ? new Set(mi(t, n)) : void 0,
    c = {};
  return (
    $t(
      c,
      t,
      Reflect.ownKeys(We(t)),
      e &&
        ((u, l) =>
          s && !s.has(l) ? u : new e({ type: "optional", innerType: u })),
    ),
    W(t, Ae(t._zod.def, { shape: c, checks: [] }))
  );
}
function Ry(e, t, n) {
  let o = n ? new Set(mi(t, n)) : void 0,
    r = {};
  return (
    $t(r, t, Reflect.ownKeys(We(t)), (i, a) =>
      o && !o.has(a) ? i : new e({ type: "nonoptional", innerType: i }),
    ),
    W(t, Ae(t._zod.def, { shape: r }))
  );
}
function fe(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue !== !0) return !0;
  return !1;
}
function Da(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue === !1) return !0;
  return !1;
}
function ye(e, t) {
  return t.map((n) => {
    var o;
    return ((o = n).path ?? (o.path = []), n.path.unshift(e), n);
  });
}
function Ft(e) {
  return typeof e == "string" ? e : e?.message;
}
function Wt(e) {
  let t = [];
  for (let n of e ?? []) {
    let o = n._zod.def;
    if (!/_(length|size)$|_equals$/.test(o.check)) break;
    let r = o.maximum ?? o.length ?? o.size;
    r >= 0 && t.push([r, n]);
  }
  return t;
}
function Yr(e, t, n) {
  var o;
  for (let r = t; r < e.length; r++) (o = e[r]).schema ?? (o.schema = n);
}
function $e(e, t, n) {
  var o;
  let r = e.inst?._zod?.traits;
  r?.has("$ZodType") &&
    (r.has("$ZodCheck")
      ? ((o = e).schema ?? (o.schema = e.inst))
      : (e.schema = e.inst));
  let i = e.schema !== e.inst ? e.schema?._zod.def?.error : void 0,
    a = e.message
      ? e.message
      : (Ft(e.inst?._zod.def?.error?.(e)) ??
        Ft(i?.(e)) ??
        Ft(t?.error?.(e)) ??
        Ft(n.customError?.(e)) ??
        Ft(n.localeError?.(e)) ??
        "Invalid input"),
    s = {};
  for (let c of Object.keys(e))
    c === "inst" ||
      c === "schema" ||
      c === "continue" ||
      c === "input" ||
      c === "__proto__" ||
      (s[c] = e[c]);
  return (
    s.path ?? (s.path = []),
    (s.message = a),
    t?.reportInput && (s.input = e.input),
    s
  );
}
function Qr(e) {
  return e instanceof Set
    ? "set"
    : e instanceof Map
      ? "map"
      : e instanceof File
        ? "file"
        : "unknown";
}
var Vy = /[\uD800-\uDBFF]/;
function bt(e) {
  let t = e.length;
  if (!Vy.test(e)) return t;
  let n = t;
  for (let o = 0; o < t - 1; o++)
    (e.charCodeAt(o) & 64512) === 55296 &&
      (e.charCodeAt(o + 1) & 64512) === 56320 &&
      (n--, o++);
  return n;
}
function en(e) {
  return Array.isArray(e)
    ? "array"
    : typeof e == "string"
      ? "string"
      : "unknown";
}
function $(e) {
  let t = typeof e;
  switch (t) {
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "object": {
      if (e === null) return "null";
      if (Array.isArray(e)) return "array";
      let n = e;
      if (
        n &&
        Object.getPrototypeOf(n) !== Object.prototype &&
        "constructor" in n &&
        n.constructor
      )
        return n.constructor.name;
    }
  }
  return t;
}
function Gt(...e) {
  let [t, n, o] = e;
  return typeof t == "string"
    ? { message: t, code: "custom", input: n, inst: o }
    : { ...t };
}
function Fy(e) {
  return Object.entries(e)
    .filter(([t, n]) => Number.isNaN(Number.parseInt(t, 10)))
    .map((t) => t[1]);
}
function Sm(e) {
  let t = atob(e),
    n = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++) n[o] = t.charCodeAt(o);
  return n;
}
function zm(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
  return btoa(t);
}
function My(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/"),
    n = "=".repeat((4 - (t.length % 4)) % 4);
  return Sm(t + n);
}
function Jy(e) {
  return zm(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function By(e) {
  let t = e.replace(/^0x/, "");
  if (t.length % 2 !== 0) throw new Error("Invalid hex string length");
  let n = new Uint8Array(t.length / 2);
  for (let o = 0; o < t.length; o += 2)
    n[o / 2] = Number.parseInt(t.slice(o, o + 2), 16);
  return n;
}
function Ky(e) {
  return Array.from(e)
    .map((t) => t.toString(16).padStart(2, "0"))
    .join("");
}
var Pa = class {
  constructor(...t) {}
};
function Ua(e, t) {
  for (let n in t) {
    let o = Object.getOwnPropertyDescriptor(t, n);
    o.get
      ? Object.defineProperty(e, n, { ...o, enumerable: !1 })
      : Gy(e, n, o.value);
  }
}
function it(e, t, n, o = !0) {
  return (
    Object.defineProperty(e, t, {
      configurable: !0,
      writable: !0,
      enumerable: o,
      value: n,
    }),
    n
  );
}
function tn(e, t, n) {
  return it(e, t, n, !1);
}
function Wy(e, t) {
  for (let n in e) {
    let o = e[n];
    Object.defineProperty(t, n, {
      configurable: !0,
      enumerable: !0,
      get() {
        return it(this, n, o(this));
      },
      set(r) {
        it(this, n, r);
      },
    });
  }
  return t;
}
function Gy(e, t, n) {
  Object.defineProperty(e, t, {
    configurable: !0,
    get() {
      return this == null ? n : it(this, t, n.bind(this));
    },
    set(o) {
      it(this, t, o);
    },
  });
}
function qy(e, t) {
  let n = Object.getPrototypeOf(e);
  return t in n ? void 0 : n;
}
var Sa,
  nt = !1,
  Xy = {
    configurable: !0,
    get() {
      nt = !0;
    },
  };
function V(e, t, n) {
  let o = Object.getPrototypeOf(e._zod);
  if (t in o && Sa !== e._zod) {
    Sa = void 0;
    return;
  }
  ((Sa = e._zod),
    Object.defineProperty(o, t, {
      configurable: !0,
      get() {
        Object.defineProperty(this, t, Xy);
        let r = nt;
        nt = !1;
        try {
          let i = n(this);
          return (
            nt
              ? delete this[t]
              : Object.defineProperty(this, t, {
                  configurable: !0,
                  writable: !0,
                  value: i,
                }),
            (nt = nt || r),
            i
          );
        } catch (i) {
          throw (delete this[t], (nt = nt || r), i);
        }
      },
      set(r) {
        Object.defineProperty(this, t, {
          configurable: !0,
          writable: !0,
          value: r,
        });
      },
    }));
}
function Hy(e, t, n, o) {
  let r = qy(e, t);
  r &&
    Object.defineProperty(r, t, {
      configurable: !0,
      get() {
        let i = {
          configurable: !0,
          writable: !0,
          enumerable: o,
          value: void 0,
        };
        return (
          Object.defineProperty(this, t, i),
          (i.value = n(this)),
          Object.defineProperty(this, t, i),
          i.value
        );
      },
      set(i) {
        Object.defineProperty(this, t, {
          configurable: !0,
          writable: !0,
          enumerable: o,
          value: i,
        });
      },
    });
}
var pi = "~constantCatch";
function Ea(e) {
  let t = () => e;
  return ((t[pi] = !0), t);
}
var Pm,
  Ca = Object.freeze({ status: "aborted" }),
  Za = { value: void 0, enumerable: !1 },
  Om = "captureStackTrace" in Error ? Error : null;
function Yy(e) {
  let t = Om;
  if (t) {
    let n = t.stackTraceLimit;
    if (typeof n == "number") {
      try {
        t.stackTraceLimit = 0;
      } catch {
        return ((Om = null), new e());
      }
      try {
        return new e();
      } finally {
        t.stackTraceLimit = n;
      }
    }
  }
  return new e();
}
function p(e, t, n, o) {
  let r = {};
  function i(f) {
    ((this.def = f), (this.constr = d), (this.traits = new Set()));
  }
  i.prototype = r;
  let a = n,
    s = a && new WeakSet();
  function c(f, m) {
    if (f._zod) {
      if (f._zod.traits.has(e)) return;
    } else {
      Za.value = new i(m);
      try {
        Object.defineProperty(f, "_zod", Za);
      } finally {
        Za.value = void 0;
      }
    }
    if ((f._zod.traits.add(e), t(f, m), s)) {
      let _ = Object.getPrototypeOf(f),
        S = f._zod.constr.prototype,
        T = _;
      for (; T && T !== S;) T = Object.getPrototypeOf(T);
      let j = T ?? _;
      s.has(j) || (s.add(j), Ua(j, a));
    }
    let v = d.prototype;
    for (let _ in v)
      Object.prototype.hasOwnProperty.call(v, _) &&
        (_ in f || (f[_] = v[_].bind(f)));
  }
  let u = o?.Parent ?? Object;
  class l extends u {}
  Object.defineProperty(l, "name", { value: e });
  function d(f) {
    let m = o?.Parent ? Yy(l) : this;
    c(m, f);
    let v = m._zod.deferred;
    if (v) {
      for (let S of v) S();
      m._zod.deferred = void 0;
    }
    let _ = globalThis.__zod_globalConfig?.postProcessor;
    return (_ && _(m), m);
  }
  return (
    Object.defineProperty(d, "init", { value: c }),
    Object.defineProperty(d, Symbol.hasInstance, {
      value: (f) =>
        o?.Parent && f instanceof o.Parent ? !0 : f?._zod?.traits?.has(e),
    }),
    Object.defineProperty(d, "name", { value: e }),
    d
  );
}
var La = Symbol("zod_brand"),
  _e = class extends Error {
    constructor() {
      super(
        "Encountered Promise during synchronous parse. Use .parseAsync() instead.",
      );
    }
  },
  ot = class extends Error {
    constructor(t) {
      (super(`Encountered unidirectional transform during encode: ${t}`),
        (this.name = "ZodEncodeError"));
    }
  };
(Pm = globalThis).__zod_globalConfig ?? (Pm.__zod_globalConfig = {});
var ae = globalThis.__zod_globalConfig;
function te(e) {
  return (e && Object.assign(ae, e), ae);
}
function Qy() {
  let e = this._zod;
  return (e.message ?? (e.message = JSON.stringify(e.def, Jt, 2)), e.message);
}
function e$(e) {
  this._zod.message = e;
}
var t$ = { get: Qy, set: e$, enumerable: !0, configurable: !0 },
  Va = { value: void 0, enumerable: !1 },
  jm = new WeakSet([Object.prototype, Error.prototype]),
  Nm = (e, t) => {
    ((e.name = "$ZodError"),
      (Va.value = t),
      Object.defineProperty(e, "issues", Va),
      (Va.value = void 0),
      Object.defineProperty(e, "message", t$));
    let n = Object.getPrototypeOf(e);
    jm.has(n) ||
      (jm.add(n),
      Object.defineProperty(n, "toString", {
        configurable: !0,
        enumerable: !1,
        get() {
          let o = () => this.message;
          return (
            Object.defineProperty(this, "toString", {
              value: o,
              configurable: !0,
              writable: !0,
            }),
            o
          );
        },
        set(o) {
          Object.defineProperty(this, "toString", {
            value: o,
            configurable: !0,
            writable: !0,
          });
        },
      }));
  },
  Fa = p("$ZodError", Nm),
  be = p("$ZodError", Nm, void 0, { Parent: Error });
function r$(e, t, n) {
  return (
    Object.prototype.hasOwnProperty.call(e, t) ||
      (t === "__proto__"
        ? Object.defineProperty(e, t, {
            value: n(),
            writable: !0,
            enumerable: !0,
            configurable: !0,
          })
        : (e[t] = n())),
    e[t]
  );
}
function rn(e, t = (n) => n.message) {
  let n = {},
    o = [];
  for (let r of e.issues)
    r.path.length > 0 ? r$(n, r.path[0], () => []).push(t(r)) : o.push(t(r));
  return { formErrors: o, fieldErrors: n };
}
function nn(e, t = (n) => n.message) {
  let n = { _errors: [] },
    o = (r, i = []) => {
      for (let a of r.issues)
        if (a.code === "invalid_union" && a.errors.length)
          a.errors.map((s) => o({ issues: s }, [...i, ...a.path]));
        else if (a.code === "invalid_key")
          o({ issues: a.issues }, [...i, ...a.path]);
        else if (a.code === "invalid_element")
          o({ issues: a.issues }, [...i, ...a.path]);
        else {
          let s = [...i, ...a.path];
          if (s.length === 0) n._errors.push(t(a));
          else {
            let c = n,
              u = 0;
            for (; u < s.length;) {
              let l = s[u],
                d = u === s.length - 1;
              if (l === "_errors") {
                (d && c._errors.push(t(a)), u++);
                continue;
              }
              Object.prototype.hasOwnProperty.call(c, l) ||
                Object.defineProperty(c, l, {
                  value: { _errors: [] },
                  enumerable: !0,
                  writable: !0,
                  configurable: !0,
                });
              let f = c[l];
              (d && f._errors.push(t(a)), (c = f), u++);
            }
          }
        }
    };
  return (o(e), n);
}
function Ma(e, t = (n) => n.message) {
  let n = { errors: [] },
    o = (r, i = []) => {
      var a;
      for (let s of r.issues)
        if (s.code === "invalid_union" && s.errors.length)
          s.errors.map((c) => o({ issues: c }, [...i, ...s.path]));
        else if (s.code === "invalid_key")
          o({ issues: s.issues }, [...i, ...s.path]);
        else if (s.code === "invalid_element")
          o({ issues: s.issues }, [...i, ...s.path]);
        else {
          let c = [...i, ...s.path];
          if (c.length === 0) {
            n.errors.push(t(s));
            continue;
          }
          let u = n,
            l = 0;
          for (; l < c.length;) {
            let d = c[l],
              f = l === c.length - 1;
            (typeof d == "string"
              ? (u.properties ?? (u.properties = {}),
                Object.prototype.hasOwnProperty.call(u.properties, d) ||
                  Object.defineProperty(u.properties, d, {
                    value: { errors: [] },
                    enumerable: !0,
                    writable: !0,
                    configurable: !0,
                  }),
                (u = u.properties[d]))
              : (u.items ?? (u.items = []),
                (a = u.items)[d] ?? (a[d] = { errors: [] }),
                (u = u.items[d])),
              f && u.errors.push(t(s)),
              l++);
          }
        }
    };
  return (o(e), n);
}
function Tm(e) {
  let t = [],
    n = e.map((o) => (typeof o == "object" ? o.key : o));
  for (let o of n)
    typeof o == "number"
      ? t.push(`[${o}]`)
      : typeof o == "symbol"
        ? t.push(`[${JSON.stringify(String(o))}]`)
        : /[^\w$]/.test(o)
          ? t.push(`[${JSON.stringify(o)}]`)
          : (t.length && t.push("."), t.push(o));
  return t.join("");
}
function Ja(e) {
  let t = [],
    n = [...e.issues].sort(
      (o, r) => (o.path ?? []).length - (r.path ?? []).length,
    );
  for (let o of n)
    (t.push(`\u2716 ${o.message}`),
      o.path?.length && t.push(`  \u2192 at ${Tm(o.path)}`));
  return t.join(`
`);
}
function gi(e, t) {
  return { callee: t?.callee ?? e, Err: t?.Err };
}
var qt = (e) => {
    let t = (n, o, r, i) => {
      let a = r ? { ...r, async: !1 } : { async: !1 },
        s = n._zod.run({ value: o, issues: [] }, a);
      if (s instanceof Promise) throw new _e();
      if (s.issues.length) {
        let c = new (i?.Err ?? e)(s.issues.map((u) => $e(u, a, te())));
        throw (fi(c, i?.callee ?? t), c);
      }
      return s.value;
    };
    return t;
  },
  vi = qt(be),
  Xt = (e) => {
    let t = async (n, o, r, i) => {
      let a = r ? { ...r, async: !0 } : { async: !0 },
        s = n._zod.run({ value: o, issues: [] }, a);
      if ((s instanceof Promise && (s = await s), s.issues.length)) {
        let c = new (i?.Err ?? e)(s.issues.map((u) => $e(u, a, te())));
        throw (fi(c, i?.callee ?? t), c);
      }
      return s.value;
    };
    return t;
  },
  hi = Xt(be),
  Ht = (e) => (t, n, o) => {
    let r = o ? { ...o, async: !1 } : { async: !1 },
      i = t._zod.run({ value: n, issues: [] }, r);
    if (i instanceof Promise) throw new _e();
    return i.issues.length
      ? Am(e, i.issues, r)
      : { success: !0, data: i.value };
  },
  i$ = Ht(be);
function Am(e, t, n) {
  let o;
  return {
    success: !1,
    get error() {
      return (
        o ||
          ((o = new e(t.map((r) => $e(r, n, te())))),
          (t = void 0),
          (n = void 0)),
        o
      );
    },
    set error(r) {
      ((o = r), (t = void 0), (n = void 0));
    },
  };
}
var Yt = (e) => async (t, n, o) => {
    let r = o ? { ...o, async: !0 } : { async: !0 },
      i = t._zod.run({ value: n, issues: [] }, r);
    return (
      i instanceof Promise && (i = await i),
      i.issues.length ? Am(e, i.issues, r) : { success: !0, data: i.value }
    );
  },
  o$ = Yt(be),
  a$ = Symbol.for("zod.compile.invalid"),
  s$ = Symbol.for("zod.compile.fallback"),
  on = (e, t, n) => {
    let o = e._zod.bag.validator;
    if (o !== void 0) {
      if (o(t) !== a$) return !0;
      if (o.definite === !0 && n === void 0) return !1;
    }
    return u$(e, t, n);
  };
function u$(e, t, n) {
  let o = n
      ? { ...n, async: !1, abortEarly: !0 }
      : { async: !1, abortEarly: !0 },
    r = e._zod.bag.fallbackRun,
    i;
  if (
    (r
      ? ((o[s$] = !0), (i = r({ value: t, issues: [] }, o)))
      : (i = e._zod.run({ value: t, issues: [] }, o)),
    i instanceof Promise)
  )
    throw new _e();
  return i.issues.length === 0;
}
var an = async (e, t, n) => {
    let o = n
        ? { ...n, async: !0, abortEarly: !0 }
        : { async: !0, abortEarly: !0 },
      r = e._zod.run({ value: t, issues: [] }, o);
    return (r instanceof Promise && (r = await r), r.issues.length === 0);
  },
  yi = (e) => {
    let t = qt(e),
      n = (o, r, i, a) => {
        let s = i ? { ...i, direction: "backward" } : { direction: "backward" };
        return t(o, r, s, gi(n, a));
      };
    return n;
  },
  c$ = yi(be),
  $i = (e) => {
    let t = qt(e),
      n = (o, r, i, a) => t(o, r, i, gi(n, a));
    return n;
  },
  l$ = $i(be),
  _i = (e) => {
    let t = Xt(e),
      n = async (o, r, i, a) => {
        let s = i ? { ...i, direction: "backward" } : { direction: "backward" };
        return await t(o, r, s, gi(n, a));
      };
    return n;
  },
  d$ = _i(be),
  bi = (e) => {
    let t = Xt(e),
      n = async (o, r, i, a) => await t(o, r, i, gi(n, a));
    return n;
  },
  f$ = bi(be),
  xi = (e) => (t, n, o) => {
    let r = o ? { ...o, direction: "backward" } : { direction: "backward" };
    return Ht(e)(t, n, r);
  },
  m$ = xi(be),
  ki = (e) => (t, n, o) => Ht(e)(t, n, o),
  p$ = ki(be),
  wi = (e) => async (t, n, o) => {
    let r = o ? { ...o, direction: "backward" } : { direction: "backward" };
    return Yt(e)(t, n, r);
  },
  g$ = wi(be),
  Ii = (e) => async (t, n, o) => Yt(e)(t, n, o),
  v$ = Ii(be);
var Ne = {};
Ke(Ne, {
  anyString: () => hs,
  base64: () => us,
  base64url: () => cs,
  bigint: () => $s,
  boolean: () => _s,
  browserEmail: () => w$,
  cidrv4: () => as,
  cidrv6: () => ss,
  creditCard: () => Si,
  cuid: () => Ka,
  cuid2: () => Wa,
  currencyCode: () => ms,
  date: () => ps,
  datetime: () => vs,
  domain: () => ds,
  duration: () => Qa,
  e164: () => fs,
  email: () => ts,
  emoji: () => rs,
  extendedDuration: () => h$,
  guid: () => es,
  hex: () => Is,
  hostname: () => ls,
  html5Email: () => b$,
  httpProtocol: () => sn,
  iban: () => zi,
  idnEmail: () => k$,
  integer: () => un,
  ipv4: () => ns,
  ipv6: () => is,
  ksuid: () => Xa,
  lowercase: () => ks,
  mac: () => os,
  md5_base64: () => P$,
  md5_base64url: () => O$,
  md5_hex: () => z$,
  nanoid: () => Ha,
  nanoidOfLength: () => Ya,
  null: () => bs,
  number: () => qe,
  rfc5322Email: () => x$,
  sha1_base64: () => N$,
  sha1_base64url: () => T$,
  sha1_hex: () => j$,
  sha256_base64: () => D$,
  sha256_base64url: () => U$,
  sha256_hex: () => A$,
  sha384_base64: () => Z$,
  sha384_base64url: () => C$,
  sha384_hex: () => E$,
  sha512_base64: () => R$,
  sha512_base64url: () => V$,
  sha512_hex: () => L$,
  string: () => ys,
  time: () => gs,
  ulid: () => Ga,
  undefined: () => xs,
  unicodeEmail: () => Dm,
  uppercase: () => ws,
  uuid: () => xt,
  uuid4: () => y$,
  uuid6: () => $$,
  uuid7: () => _$,
  xid: () => qa,
});
var Ka = /^[cC][0-9a-z]{6,}$/,
  Wa = /^[0-9a-z]+$/,
  Ga = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/,
  qa = /^[0-9a-vA-V]{20}$/,
  Xa = /^[A-Za-z0-9]{27}$/,
  Ha = /^[a-zA-Z0-9_-]{21}$/;
function Ya(e) {
  return new RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var Qa =
    /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,
  h$ =
    /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  es =
    /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  xt = (e) =>
    e
      ? new RegExp(
          `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
        )
      : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
  y$ = xt(4),
  $$ = xt(6),
  _$ = xt(7),
  ts =
    /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
  b$ =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  x$ =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  Dm = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u,
  k$ = Dm,
  w$ =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  I$ =
    "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function rs() {
  return new RegExp(I$, "u");
}
var ns =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  is =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
  os = (e) => {
    let t = je(e ?? ":");
    return new RegExp(
      `^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`,
    );
  },
  as =
    /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
  ss =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  us =
    /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
  cs = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/,
  ls =
    /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/,
  ds =
    /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/,
  sn = /^https?$/,
  fs = /^\+[1-9]\d{6,14}$/,
  Si = /^\d(?:[ -]?\d){11,18}$/,
  ms =
    /^(?:AED|AFN|ALL|AMD|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BHD|BIF|BMD|BND|BOB|BOV|BRL|BSD|BTN|BWP|BYN|BZD|CAD|CDF|CHE|CHF|CHW|CLF|CLP|CNY|COP|COU|CRC|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HTG|HUF|IDR|ILS|INR|IQD|IRR|ISK|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRU|MUR|MVR|MWK|MXN|MXV|MYR|MZN|NAD|NGN|NIO|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SBD|SCR|SDG|SEK|SGD|SHP|SLE|SOS|SRD|SSP|STN|SVC|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|USN|UYI|UYU|UYW|UZS|VED|VES|VND|VUV|WST|XAD|XAF|XAG|XAU|XBA|XBB|XBC|XBD|XCD|XCG|XDR|XOF|XPD|XPF|XPT|XSU|XTS|XUA|XXX|YER|ZAR|ZMW|ZWG)$/,
  zi = /^[A-Z]{2}(?!00|01|99)\d{2}[A-Z0-9]{11,30}$/,
  Um =
    "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function S$(e) {
  return new RegExp(`^${e}$`);
}
var ps = S$(Um);
function Ba(e) {
  let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number"
    ? e.precision === -1
      ? `${t}`
      : e.precision === 0
        ? `${t}:[0-5]\\d`
        : `${t}:[0-5]\\d\\.\\d{${e.precision}}`
    : e.seconds
      ? `${t}:[0-5]\\d(?:\\.\\d+)?`
      : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function gs(e) {
  return new RegExp(`^${Ba(e)}$`);
}
function vs(e) {
  let t = ["Z"];
  e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let n = `${Ba({ precision: e.precision, seconds: !0 })}(?:${t.join("|")})`,
    o = e.local ? `${n}|${Ba({ precision: e.precision })}` : n;
  return new RegExp(`^${Um}T(?:${o})$`);
}
var hs = /^[\s\S]{0,}$/,
  ys = (e) => {
    let t = e
      ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}`
      : "[\\s\\S]*";
    return new RegExp(`^${t}$`);
  },
  $s = /^-?\d+n?$/,
  un = /^-?\d+$/,
  qe = /^-?\d+(?:\.\d+)?$/,
  _s = /^(?:true|false)$/i,
  bs = /^null$/i;
var xs = /^undefined$/i;
var ks = /^[^A-Z]*$/,
  ws = /^[^a-z]*$/,
  Is = /^[0-9a-fA-F]*$/;
function cn(e, t) {
  return new RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`);
}
function ln(e) {
  return new RegExp(`^[A-Za-z0-9_-]{${e}}$`);
}
var z$ = /^[0-9a-fA-F]{32}$/,
  P$ = cn(22, "=="),
  O$ = ln(22),
  j$ = /^[0-9a-fA-F]{40}$/,
  N$ = cn(27, "="),
  T$ = ln(27),
  A$ = /^[0-9a-fA-F]{64}$/,
  D$ = cn(43, "="),
  U$ = ln(43),
  E$ = /^[0-9a-fA-F]{96}$/,
  Z$ = cn(64, ""),
  C$ = ln(64),
  L$ = /^[0-9a-fA-F]{128}$/,
  R$ = cn(86, "=="),
  V$ = ln(86);
var Y = p("$ZodCheck", (e, t) => {
    var n;
    (e._zod ?? (e._zod = {}),
      (e._zod.def = t),
      (n = e._zod).onattach ?? (n.onattach = []));
  }),
  Ss = (e) => {
    let t = e.value;
    return !di(t) && t.size !== void 0;
  },
  zs = (e) => {
    let t = e.value;
    return !di(t) && t.length !== void 0;
  },
  Pi = { number: "number", bigint: "bigint", object: "date" },
  ji = p("$ZodCheckLessThan", (e, t) => {
    Y.init(e, t);
    let n = Pi[typeof t.value];
    e._zod.check = (o) => {
      (t.inclusive ? o.value <= t.value : o.value < t.value) ||
        o.issues.push({
          origin: Pi[typeof o.value] ?? n,
          code: "too_big",
          maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
          input: o.value,
          inclusive: t.inclusive,
          inst: e,
          continue: !t.abort,
        });
    };
  }),
  Ni = p("$ZodCheckGreaterThan", (e, t) => {
    Y.init(e, t);
    let n = Pi[typeof t.value];
    e._zod.check = (o) => {
      (t.inclusive ? o.value >= t.value : o.value > t.value) ||
        o.issues.push({
          origin: Pi[typeof o.value] ?? n,
          code: "too_small",
          minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
          input: o.value,
          inclusive: t.inclusive,
          inst: e,
          continue: !t.abort,
        });
    };
  }),
  Ps = p("$ZodCheckMultipleOf", (e, t) => {
    (Y.init(e, t),
      (e._zod.check = (n) => {
        if (typeof n.value != typeof t.value)
          throw new Error("Cannot mix number and bigint in multiple_of check.");
        (typeof n.value == "bigint"
          ? t.value !== BigInt(0) && n.value % t.value === BigInt(0)
          : Wr(n.value, t.value) === 0) ||
          n.issues.push({
            origin: typeof n.value,
            code: "not_multiple_of",
            divisor: t.value,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  Os = p("$ZodCheckNumberFormat", (e, t) => {
    (Y.init(e, t), (t.format = t.format || "float64"));
    let n = t.format?.includes("int"),
      o = n ? "int" : "number",
      [r, i] = Xr[t.format];
    e._zod.check = (a) => {
      let s = a.value;
      if (n) {
        if (!Number.isInteger(s)) {
          a.issues.push({
            expected: o,
            format: t.format,
            code: "invalid_type",
            continue: !1,
            input: s,
            inst: e,
          });
          return;
        }
        if (!Number.isSafeInteger(s)) {
          s > 0
            ? a.issues.push({
                input: s,
                code: "too_big",
                maximum: Number.MAX_SAFE_INTEGER,
                note: "Integers must be within the safe integer range.",
                inst: e,
                origin: o,
                inclusive: !0,
                continue: !t.abort,
              })
            : a.issues.push({
                input: s,
                code: "too_small",
                minimum: Number.MIN_SAFE_INTEGER,
                note: "Integers must be within the safe integer range.",
                inst: e,
                origin: o,
                inclusive: !0,
                continue: !t.abort,
              });
          return;
        }
      }
      (s < r &&
        a.issues.push({
          origin: "number",
          input: s,
          code: "too_small",
          minimum: r,
          inclusive: !0,
          inst: e,
          continue: !t.abort,
        }),
        s > i &&
          a.issues.push({
            origin: "number",
            input: s,
            code: "too_big",
            maximum: i,
            inclusive: !0,
            inst: e,
            continue: !t.abort,
          }));
    };
  }),
  js = p("$ZodCheckBigIntFormat", (e, t) => {
    Y.init(e, t);
    let [n, o] = Hr[t.format];
    e._zod.check = (r) => {
      let i = r.value;
      (i < n &&
        r.issues.push({
          origin: "bigint",
          input: i,
          code: "too_small",
          minimum: n,
          inclusive: !0,
          inst: e,
          continue: !t.abort,
        }),
        i > o &&
          r.issues.push({
            origin: "bigint",
            input: i,
            code: "too_big",
            maximum: o,
            inclusive: !0,
            inst: e,
            continue: !t.abort,
          }));
    };
  }),
  Ns = p("$ZodCheckMaxSize", (e, t) => {
    var n;
    (Y.init(e, t),
      (n = e._zod.def).when ?? (n.when = Ss),
      (e._zod.check = (o) => {
        let r = o.value;
        r.size <= t.maximum ||
          o.issues.push({
            origin: Qr(r),
            code: "too_big",
            maximum: t.maximum,
            inclusive: !0,
            input: r,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  Ts = p("$ZodCheckMinSize", (e, t) => {
    var n;
    (Y.init(e, t),
      (n = e._zod.def).when ?? (n.when = Ss),
      (e._zod.check = (o) => {
        let r = o.value;
        r.size >= t.minimum ||
          o.issues.push({
            origin: Qr(r),
            code: "too_small",
            minimum: t.minimum,
            inclusive: !0,
            input: r,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  As = p("$ZodCheckSizeEquals", (e, t) => {
    var n;
    (Y.init(e, t),
      (n = e._zod.def).when ?? (n.when = Ss),
      (e._zod.check = (o) => {
        let r = o.value,
          i = r.size;
        if (i === t.size) return;
        let a = i > t.size;
        o.issues.push({
          origin: Qr(r),
          ...(a
            ? { code: "too_big", maximum: t.size }
            : { code: "too_small", minimum: t.size }),
          inclusive: !0,
          exact: !0,
          input: o.value,
          inst: e,
          continue: !t.abort,
        });
      }));
  }),
  Ds = p("$ZodCheckMaxLength", (e, t) => {
    var n;
    (Y.init(e, t),
      (n = e._zod.def).when ?? (n.when = zs),
      (e._zod.check = (o) => {
        let r = o.value,
          i = r.length;
        if ((typeof r == "string" && i > t.maximum ? bt(r) : i) <= t.maximum)
          return;
        let s = en(r);
        o.issues.push({
          origin: s,
          code: "too_big",
          maximum: t.maximum,
          inclusive: !0,
          input: r,
          inst: e,
          continue: !t.abort,
        });
      }));
  }),
  Us = p("$ZodCheckMinLength", (e, t) => {
    var n;
    (Y.init(e, t),
      (n = e._zod.def).when ?? (n.when = zs),
      (e._zod.check = (o) => {
        let r = o.value,
          i = r.length;
        if (
          (typeof r == "string" && i >= t.minimum && i < t.minimum * 2
            ? bt(r)
            : i) >= t.minimum
        )
          return;
        let s = en(r);
        o.issues.push({
          origin: s,
          code: "too_small",
          minimum: t.minimum,
          inclusive: !0,
          input: r,
          inst: e,
          continue: !t.abort,
        });
      }));
  }),
  Es = p("$ZodCheckLengthEquals", (e, t) => {
    var n;
    (Y.init(e, t),
      (n = e._zod.def).when ?? (n.when = zs),
      (e._zod.check = (o) => {
        let r = o.value,
          i = r.length,
          a =
            typeof r == "string" && i >= t.length && i <= t.length * 2
              ? bt(r)
              : i;
        if (a === t.length) return;
        let s = en(r),
          c = a > t.length;
        o.issues.push({
          origin: s,
          ...(c
            ? { code: "too_big", maximum: t.length }
            : { code: "too_small", minimum: t.length }),
          inclusive: !0,
          exact: !0,
          input: o.value,
          inst: e,
          continue: !t.abort,
        });
      }));
  }),
  Qt = p("$ZodCheckStringFormat", (e, t) => {
    var n, o;
    (Y.init(e, t),
      t.pattern
        ? ((n = e._zod).check ??
          (n.check = (r) => {
            ((t.pattern.lastIndex = 0),
              !t.pattern.test(r.value) &&
                r.issues.push({
                  origin: "string",
                  code: "invalid_format",
                  format: t.format,
                  input: r.value,
                  ...(t.pattern ? { pattern: t.pattern.toString() } : {}),
                  inst: e,
                  continue: !t.abort,
                }));
          }))
        : ((o = e._zod).check ?? (o.check = () => {})));
  }),
  Zs = p("$ZodCheckRegex", (e, t) => {
    (Qt.init(e, t),
      (e._zod.check = (n) => {
        ((t.pattern.lastIndex = 0),
          !t.pattern.test(n.value) &&
            n.issues.push({
              origin: "string",
              code: "invalid_format",
              format: "regex",
              input: n.value,
              pattern: t.pattern.toString(),
              inst: e,
              continue: !t.abort,
            }));
      }));
  }),
  Cs = p("$ZodCheckLowerCase", (e, t) => {
    (t.pattern ?? (t.pattern = ks), Qt.init(e, t));
  }),
  Ls = p("$ZodCheckUpperCase", (e, t) => {
    (t.pattern ?? (t.pattern = ws), Qt.init(e, t));
  }),
  Rs = p("$ZodCheckIncludes", (e, t) => {
    Y.init(e, t);
    let n = je(t.includes),
      o = new RegExp(
        typeof t.position == "number" ? `^.{${t.position},}${n}` : n,
      );
    ((t.pattern = o),
      (e._zod.check = (r) => {
        r.value.includes(t.includes, t.position) ||
          r.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "includes",
            includes: t.includes,
            input: r.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  Vs = p("$ZodCheckStartsWith", (e, t) => {
    Y.init(e, t);
    let n = new RegExp(`^${je(t.prefix)}.*`);
    (t.pattern ?? (t.pattern = n),
      (e._zod.check = (o) => {
        o.value.startsWith(t.prefix) ||
          o.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "starts_with",
            prefix: t.prefix,
            input: o.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  Fs = p("$ZodCheckEndsWith", (e, t) => {
    Y.init(e, t);
    let n = new RegExp(`.*${je(t.suffix)}$`);
    (t.pattern ?? (t.pattern = n),
      (e._zod.check = (o) => {
        o.value.endsWith(t.suffix) ||
          o.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "ends_with",
            suffix: t.suffix,
            input: o.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  });
function Oi(e, t, n) {
  e.issues.length && t.issues.push(...ye(n, e.issues));
}
var Ms = p("$ZodCheckProperty", (e, t) => {
    (Y.init(e, t),
      (e._zod.check = (n) => {
        let o = t.schema._zod.run(
          { value: n.value[t.property], issues: [] },
          {},
        );
        if (o instanceof Promise) return o.then((r) => Oi(r, n, t.property));
        Oi(o, n, t.property);
      }));
  }),
  Js = p("$ZodCheckProperties", (e, t) => {
    (Y.init(e, t),
      tn(e, Symbol.iterator, function* () {
        yield e;
      }));
    let n;
    e._zod.check = (o) => {
      if (o.value == null) {
        o.issues.push({
          expected: "object",
          code: "invalid_type",
          input: o.value,
          inst: e,
        });
        return;
      }
      n ?? (n = Reflect.ownKeys(t.shape).map((a) => [a, t.shape[a]]));
      let r = o.value,
        i;
      for (let [a, s] of n) {
        let c = s._zod.run({ value: r[a], issues: [] }, {});
        c instanceof Promise
          ? (i ?? (i = []), i.push(c.then((u) => Oi(u, o, a))))
          : Oi(c, o, a);
      }
      if (i) return Promise.all(i).then(() => {});
    };
  }),
  Bs = p("$ZodCheckMimeType", (e, t) => {
    Y.init(e, t);
    let n = new Set(t.mime);
    e._zod.check = (o) => {
      n.has(o.value.type) ||
        o.issues.push({
          code: "invalid_value",
          values: t.mime,
          input: o.value.type,
          inst: e,
          continue: !t.abort,
        });
    };
  }),
  Ks = p("$ZodCheckOverwrite", (e, t) => {
    (Y.init(e, t),
      (e._zod.check = (n) => {
        n.value = t.tx(n.value);
      }));
  });
var kt = class {
  constructor(t = [], n = {}) {
    ((this.content = []),
      (this.indent = 0),
      (this.args = t),
      (this.closed = n));
  }
  indented(t) {
    this.indent += 1;
    try {
      t(this);
    } finally {
      this.indent -= 1;
    }
  }
  write(t) {
    if (typeof t == "function") {
      (t(this, { execution: "sync" }), t(this, { execution: "async" }));
      return;
    }
    let o = t
        .split(
          `
`,
        )
        .filter((a) => a),
      r = Math.min(...o.map((a) => a.length - a.trimStart().length)),
      i = o.map((a) => a.slice(r)).map((a) => " ".repeat(this.indent * 2) + a);
    for (let a of i) this.content.push(a);
  }
  compile() {
    let t = Function,
      n = this?.content ?? [""];
    return new t(
      ...Object.keys(this.closed),
      `return function (${this.args.join(", ")}) {
${n.join(`
`)}
};`,
    )(...Object.values(this.closed));
  }
};
var Ws = { major: 4, minor: 6, patch: 7 };
var C = p(
    "$ZodType",
    (e, t) => {
      var n;
      (e ?? (e = {}),
        (e._zod.def = t),
        (e._zod.bag = e._zod.bag || {}),
        (e._zod.version = Ws));
      let o = e._zod.def.checks,
        r = e._zod.traits.has("$ZodCheck")
          ? [e, ...(o ?? [])]
          : o?.length
            ? [...o]
            : [];
      for (let i of r) for (let a of i._zod.onattach) a(e);
      if (r.length === 0)
        ((n = e._zod).deferred ?? (n.deferred = []),
          e._zod.deferred?.push(() => {
            e._zod.run = e._zod.parse;
          }));
      else {
        let i = (s, c, u) => {
            if (s.memo) return s;
            let l = fe(s),
              d;
            for (let f of c) {
              if (f._zod.def.when) {
                if (Da(s) || !f._zod.def.when(s)) continue;
              } else if (l) continue;
              let m = s.issues.length,
                v = f._zod.check(s);
              if (v instanceof Promise && u?.async === !1) throw new _e();
              if (d || v instanceof Promise)
                d = (d ?? Promise.resolve()).then(async () => {
                  (await v,
                    s.issues.length !== m &&
                      (Yr(s.issues, m, e), l || (l = fe(s, m))));
                });
              else {
                if (s.issues.length === m) continue;
                (Yr(s.issues, m, e), l || (l = fe(s, m)));
              }
            }
            return d ? d.then(() => s) : s;
          },
          a = (s, c, u) => {
            if (fe(s)) return ((s.aborted = !0), s);
            let l = i(c, r, u);
            if (l instanceof Promise) {
              if (u.async === !1) throw new _e();
              return l.then((d) => e._zod.parse(d, u));
            }
            return e._zod.parse(l, u);
          };
        e._zod.run = (s, c) => {
          if (c.skipChecks) return e._zod.parse(s, c);
          if (c.direction === "backward") {
            let l = e._zod.parse(
              { value: s.value, issues: [] },
              { ...c, skipChecks: !0 },
            );
            return l instanceof Promise
              ? l.then((d) => a(d, s, c))
              : a(l, s, c);
          }
          let u = e._zod.parse(s, c);
          if (u instanceof Promise) {
            if (c.async === !1) throw new _e();
            return u.then((l) => i(l, r, c));
          }
          return i(u, r, c);
        };
      }
    },
    {
      get "~standard"() {
        return tn(this, "~standard", Ei(this));
      },
      set "~standard"(e) {
        it(this, "~standard", e);
      },
    },
  ),
  Ym = (e, t) =>
    e.issues.length
      ? { issues: e.issues.map((n) => $e(n, t, te())) }
      : { value: e.value };
async function F$(e, t) {
  let n = { async: !0 };
  return Ym(await e._zod.run({ value: t, issues: [] }, n), n);
}
function Ei(e) {
  return {
    validate: (t) => {
      let n = { async: !1 };
      try {
        let o = e._zod.run({ value: t, issues: [] }, n);
        if (!(o instanceof Promise)) return Ym(o, n);
      } catch {}
      return F$(e, t);
    },
    vendor: "zod",
    version: 1,
  };
}
var wt = p("$ZodString", (e, t) => {
    (C.init(e, t),
      (e._zod.pattern = t.pattern ?? hs),
      (e._zod.parse = (n, o) => {
        if (t.coerce)
          try {
            n.value = String(n.value);
          } catch {}
        return (
          typeof n.value == "string" ||
            n.issues.push({
              expected: "string",
              code: "invalid_type",
              input: n.value,
              inst: e,
            }),
          n
        );
      }));
  }),
  G = p("$ZodStringFormat", (e, t) => {
    (Qt.init(e, t), wt.init(e, t));
  }),
  qs = p("$ZodGUID", (e, t) => {
    (t.pattern ?? (t.pattern = es), G.init(e, t));
  }),
  Xs = p("$ZodUUID", (e, t) => {
    if (t.version) {
      let o = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[
        t.version
      ];
      if (o === void 0) throw new Error(`Invalid UUID version: "${t.version}"`);
      t.pattern ?? (t.pattern = xt(o));
    } else t.pattern ?? (t.pattern = xt());
    G.init(e, t);
  }),
  Hs = p("$ZodEmail", (e, t) => {
    (t.pattern ?? (t.pattern = ts), G.init(e, t));
  }),
  Ys = 1,
  dn = 2;
function Qs(e) {
  try {
    return typeof URL < "u" && typeof URL.canParse == "function"
      ? URL.canParse(e)
      : (new URL(e), !0);
  } catch {
    return !1;
  }
}
function Zi(e, t) {
  return !("normalize" in t) && !("hostname" in t) && !("protocol" in t)
    ? Qs(e) || dn
    : Qm(e, t);
}
function Qm(e, t) {
  if (
    !t.normalize &&
    t.protocol?.source === sn.source &&
    !/^https?:\/\//i.test(e)
  )
    return Ys;
  try {
    if (typeof URL < "u") {
      let n = URL;
      if (typeof n.parse == "function") return n.parse(e) ?? dn;
    }
    return new URL(e);
  } catch {
    return dn;
  }
}
var M$ = /[\t\n\r]/g;
function fn(e) {
  return e.replace(M$, "");
}
function Ci(e, t) {
  return ((t.lastIndex = 0), t.test(e.hostname));
}
function Li(e, t) {
  return (
    (t.lastIndex = 0),
    t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol)
  );
}
var eu = p("$ZodURL", (e, t) => {
    (G.init(e, t),
      (e._zod.check = (n) => {
        try {
          let o = n.value.trim(),
            r = Zi(o, t);
          if (r === Ys) {
            n.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid URL format",
              input: n.value,
              inst: e,
              continue: !t.abort,
            });
            return;
          }
          if (r === dn) {
            n.issues.push({
              code: "invalid_format",
              format: "url",
              input: n.value,
              inst: e,
              continue: !t.abort,
            });
            return;
          }
          if (r === !0) {
            n.value = fn(o);
            return;
          }
          (t.hostname &&
            !Ci(r, t.hostname) &&
            n.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid hostname",
              pattern: t.hostname.source,
              input: n.value,
              inst: e,
              continue: !t.abort,
            }),
            t.protocol &&
              !Li(r, t.protocol) &&
              n.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid protocol",
                pattern: t.protocol.source,
                input: n.value,
                inst: e,
                continue: !t.abort,
              }),
            (n.value = t.normalize ? r.href : fn(o)));
          return;
        } catch {
          n.issues.push({
            code: "invalid_format",
            format: "url",
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
        }
      }));
  }),
  tu = p("$ZodEmoji", (e, t) => {
    (t.pattern ?? (t.pattern = rs()), G.init(e, t));
  }),
  ru = p("$ZodNanoID", (e, t) => {
    if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1))
      throw new Error(`Invalid nanoid length: ${t.length}`);
    (t.pattern ?? (t.pattern = t.length === void 0 ? Ha : Ya(t.length)),
      G.init(e, t));
  }),
  nu = p("$ZodCUID", (e, t) => {
    (t.pattern ?? (t.pattern = Ka), G.init(e, t));
  }),
  iu = p("$ZodCUID2", (e, t) => {
    (t.pattern ?? (t.pattern = Wa), G.init(e, t));
  }),
  ou = p("$ZodULID", (e, t) => {
    (t.pattern ?? (t.pattern = Ga), G.init(e, t));
  }),
  au = p("$ZodXID", (e, t) => {
    (t.pattern ?? (t.pattern = qa), G.init(e, t));
  }),
  su = p("$ZodKSUID", (e, t) => {
    (t.pattern ?? (t.pattern = Xa), G.init(e, t));
  }),
  uu = p("$ZodISODateTime", (e, t) => {
    (t.pattern ?? (t.pattern = vs(t)), G.init(e, t));
  }),
  cu = p("$ZodISODate", (e, t) => {
    (t.pattern ?? (t.pattern = ps), G.init(e, t));
  }),
  lu = p("$ZodISOTime", (e, t) => {
    (t.pattern ?? (t.pattern = gs(t)), G.init(e, t));
  }),
  du = p("$ZodISODuration", (e, t) => {
    (t.pattern ?? (t.pattern = Qa), G.init(e, t));
  }),
  fu = p("$ZodIPv4", (e, t) => {
    (t.pattern ?? (t.pattern = ns), G.init(e, t));
  }),
  J$ = /^[0-9a-fA-F:.]+$/;
function mn(e) {
  return J$.test(e) ? Qs(`http://[${e}]`) : !1;
}
var mu = p("$ZodIPv6", (e, t) => {
    (t.pattern ?? (t.pattern = is),
      G.init(e, t),
      (e._zod.check = (n) => {
        mn(n.value) ||
          n.issues.push({
            code: "invalid_format",
            format: "ipv6",
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  pu = p("$ZodMAC", (e, t) => {
    (t.pattern ?? (t.pattern = os(t.delimiter)), G.init(e, t));
  }),
  gu = p("$ZodCIDRv4", (e, t) => {
    (t.pattern ?? (t.pattern = as), G.init(e, t));
  });
function Ri(e) {
  let t = e.split("/");
  if (t.length !== 2) return !1;
  let [n, o] = t;
  if (!o) return !1;
  let r = Number(o);
  return `${r}` !== o || r < 0 || r > 128 ? !1 : mn(n);
}
var vu = p("$ZodCIDRv6", (e, t) => {
  (t.pattern ?? (t.pattern = ss),
    G.init(e, t),
    (e._zod.check = (n) => {
      Ri(n.value) ||
        n.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: n.value,
          inst: e,
          continue: !t.abort,
        });
    }));
});
function pn(e) {
  if (e === "") return !0;
  if (/\s/.test(e) || e.length % 4 !== 0) return !1;
  try {
    return (atob(e), !0);
  } catch {
    return !1;
  }
}
var Vi = /^[0-9a-zA-Z+/]*={0,2}$/,
  hu = p("$ZodBase64", (e, t) => {
    (t.pattern ?? (t.pattern = Vi),
      G.init(e, t),
      (e._zod.check = (n) => {
        pn(n.value) ||
          n.issues.push({
            code: "invalid_format",
            format: "base64",
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  gn = /^[A-Za-z0-9_-]*$/;
function Fi(e) {
  if (!gn.test(e)) return !1;
  let t = e.replace(/[-_]/g, (o) => (o === "-" ? "+" : "/")),
    n = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return pn(n);
}
var yu = p("$ZodBase64URL", (e, t) => {
    (t.pattern ?? (t.pattern = gn),
      G.init(e, t),
      (e._zod.check = (n) => {
        Fi(n.value) ||
          n.issues.push({
            code: "invalid_format",
            format: "base64url",
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  $u = p("$ZodE164", (e, t) => {
    (t.pattern ?? (t.pattern = fs), G.init(e, t));
  }),
  B$ = /[- ]/g;
function K$(e) {
  let t = e.length,
    n = 1,
    o = 0;
  for (; t;) {
    let r = e.charCodeAt(--t) - 48;
    ((n ^= 1), (o += n ? [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][r] : r));
  }
  return o % 10 === 0;
}
function Mi(e) {
  return Si.test(e) ? K$(e.replace(B$, "")) : !1;
}
var _u = p("$ZodCreditCard", (e, t) => {
  (t.pattern ?? (t.pattern = Si),
    G.init(e, t),
    (e._zod.check = (n) => {
      Mi(n.value) ||
        n.issues.push({
          code: "invalid_format",
          format: "credit_card",
          input: n.value,
          inst: e,
          continue: !t.abort,
        });
    }));
});
function W$(e) {
  let t = 0,
    n = e.length;
  for (let o = 4; o < n; o++) {
    let r = e.charCodeAt(o);
    t = (r >= 65 ? t * 100 + (r - 55) : t * 10 + (r - 48)) % 97;
  }
  for (let o = 0; o < 4; o++) {
    let r = e.charCodeAt(o);
    t = (r >= 65 ? t * 100 + (r - 55) : t * 10 + (r - 48)) % 97;
  }
  return t === 1;
}
function Ji(e) {
  return zi.test(e) ? W$(e) : !1;
}
var bu = p("$ZodIBAN", (e, t) => {
  (t.pattern ?? (t.pattern = zi),
    G.init(e, t),
    (e._zod.check = (n) => {
      Ji(n.value) ||
        n.issues.push({
          code: "invalid_format",
          format: "iban",
          input: n.value,
          inst: e,
          continue: !t.abort,
        });
    }));
});
function Bi(e, t = null) {
  try {
    let n = e.split(".");
    if (n.length !== 3) return !1;
    let [o] = n;
    if (!o) return !1;
    let r = JSON.parse(atob(o));
    return !(
      ("typ" in r && r?.typ !== "JWT") ||
      !r.alg ||
      (t && (!("alg" in r) || r.alg !== t))
    );
  } catch {
    return !1;
  }
}
var xu = p("$ZodJWT", (e, t) => {
    (G.init(e, t),
      (e._zod.check = (n) => {
        Bi(n.value, t.alg) ||
          n.issues.push({
            code: "invalid_format",
            format: "jwt",
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  ku = p("$ZodCustomStringFormat", (e, t) => {
    (G.init(e, t),
      (e._zod.check = (n) => {
        t.fn(n.value) ||
          n.issues.push({
            code: "invalid_format",
            format: t.format,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      }));
  }),
  Ki = p("$ZodNumber", (e, t) => {
    (C.init(e, t),
      (e._zod.pattern = qe),
      (e._zod.parse = (n, o) => {
        if (t.coerce)
          try {
            n.value = Number(n.value);
          } catch {}
        let r = n.value;
        if (typeof r == "number" && !Number.isNaN(r) && Number.isFinite(r))
          return n;
        let i =
          typeof r == "number"
            ? Number.isNaN(r)
              ? "NaN"
              : Number.isFinite(r)
                ? void 0
                : String(r)
            : void 0;
        return (
          n.issues.push({
            expected: "number",
            code: "invalid_type",
            input: r,
            inst: e,
            ...(i ? { received: i } : {}),
          }),
          n
        );
      }));
  }),
  wu = p("$ZodNumberFormat", (e, t) => {
    (Os.init(e, t), Ki.init(e, t));
  }),
  vn = p("$ZodBoolean", (e, t) => {
    (C.init(e, t),
      (e._zod.pattern = _s),
      (e._zod.parse = (n, o) => {
        if (t.coerce)
          try {
            n.value = !!n.value;
          } catch {}
        let r = n.value;
        return (
          typeof r == "boolean" ||
            n.issues.push({
              expected: "boolean",
              code: "invalid_type",
              input: r,
              inst: e,
            }),
          n
        );
      }));
  }),
  Wi = p("$ZodBigInt", (e, t) => {
    (C.init(e, t),
      (e._zod.pattern = $s),
      (e._zod.parse = (n, o) => {
        if (t.coerce)
          try {
            n.value = BigInt(n.value);
          } catch {}
        return (
          typeof n.value == "bigint" ||
            n.issues.push({
              expected: "bigint",
              code: "invalid_type",
              input: n.value,
              inst: e,
            }),
          n
        );
      }));
  }),
  Iu = p("$ZodBigIntFormat", (e, t) => {
    (js.init(e, t), Wi.init(e, t));
  }),
  Su = p("$ZodSymbol", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) => {
        let r = n.value;
        return (
          typeof r == "symbol" ||
            n.issues.push({
              expected: "symbol",
              code: "invalid_type",
              input: r,
              inst: e,
            }),
          n
        );
      }));
  }),
  zu = p("$ZodUndefined", (e, t) => {
    (C.init(e, t),
      (e._zod.pattern = xs),
      (e._zod.values = new Set([void 0])),
      (e._zod.parse = (n, o) => {
        let r = n.value;
        return (
          typeof r > "u" ||
            n.issues.push({
              expected: "undefined",
              code: "invalid_type",
              input: r,
              inst: e,
            }),
          n
        );
      }));
  }),
  Pu = p("$ZodNull", (e, t) => {
    (C.init(e, t),
      (e._zod.pattern = bs),
      (e._zod.values = new Set([null])),
      (e._zod.parse = (n, o) => {
        let r = n.value;
        return (
          r === null ||
            n.issues.push({
              expected: "null",
              code: "invalid_type",
              input: r,
              inst: e,
            }),
          n
        );
      }));
  }),
  Ou = p("$ZodAny", (e, t) => {
    (C.init(e, t), (e._zod.parse = (n) => n));
  }),
  ju = p("$ZodUnknown", (e, t) => {
    (C.init(e, t), (e._zod.parse = (n) => n));
  }),
  Nu = p("$ZodNever", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) => (
        n.issues.push({
          expected: "never",
          code: "invalid_type",
          input: n.value,
          inst: e,
        }),
        n
      )));
  }),
  Tu = p("$ZodVoid", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) => {
        let r = n.value;
        return (
          typeof r > "u" ||
            n.issues.push({
              expected: "void",
              code: "invalid_type",
              input: r,
              inst: e,
            }),
          n
        );
      }));
  }),
  Au = p("$ZodDate", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) => {
        if (t.coerce)
          try {
            n.value = new Date(n.value);
          } catch {}
        let r = n.value,
          i = r instanceof Date;
        return (
          (i && !Number.isNaN(r.getTime())) ||
            n.issues.push({
              expected: "date",
              code: "invalid_type",
              input: r,
              ...(i ? { received: "Invalid Date" } : {}),
              inst: e,
            }),
          n
        );
      }));
  });
function Du(e, t) {
  let n = Wt(e._zod.def.checks);
  if (!n.length) return;
  let o = Math.min(...n.map((i) => i[0])),
    r = e._zod.parse;
  e._zod.parse = (i, a) => {
    let s = t(i.value);
    if (s > o && !a?.skipChecks && a?.direction !== "backward") {
      for (let [c, u] of Wt(e._zod.def.checks))
        if (s > c && u._zod.def.when(i)) {
          let l = i.issues.length;
          return (
            u._zod.check(i),
            (i.issues[l].continue = !1),
            Yr(i.issues, l, e),
            i
          );
        }
    }
    return r(i, a);
  };
}
var G$ = (e) => (Array.isArray(e) ? e.length : -1),
  q$ = (e) => (e instanceof Map ? e.size : -1),
  X$ = (e) => (e instanceof Set ? e.size : -1);
function Zm(e, t, n) {
  (e.issues.length && t.issues.push(...ye(n, e.issues)),
    (t.value[n] = e.value));
}
var Uu = p("$ZodArray", (e, t) => {
  C.init(e, t);
  let n = ae.memoizer;
  (n?.attach(e),
    (e._zod.parse = (o, r) => {
      let i = o.value;
      if (!Array.isArray(i))
        return (
          o.issues.push({
            expected: "array",
            code: "invalid_type",
            input: i,
            inst: e,
          }),
          o
        );
      o.value = n ? n.alloc(e, o, Array(i.length), r) : Array(i.length);
      let a = [],
        s = r?.abortEarly;
      for (let c = 0; c < i.length; c++) {
        let u = i[c],
          l = t.element._zod.run({ value: u, issues: [] }, r);
        if (l instanceof Promise) a.push(l.then((d) => Zm(d, o, c)));
        else if ((Zm(l, o, c), s && l.issues.length !== 0 && fe(l))) break;
      }
      return a.length ? Promise.all(a).then(() => o) : o;
    }),
    Du(e, G$));
});
function Ui(e, t, n, o, r, i) {
  let a = n in o,
    s = i === "optional";
  if (!(!a && s && r === "optional")) {
    if (e.issues.length) {
      if (r !== void 0 && s && !a) return;
      t.issues.push(...ye(n, e.issues));
    }
    if (!a && r === void 0) {
      e.issues.length ||
        t.issues.push({
          code: "invalid_type",
          expected: "nonoptional",
          input: void 0,
          path: [n],
        });
      return;
    }
    e.value === void 0
      ? (a || (r === "defaulted" && !s)) && (t.value[n] = void 0)
      : (t.value[n] = e.value);
  }
}
var H$ = [];
function ep(e) {
  let t = Object.keys(e.shape),
    n = Object.getOwnPropertySymbols(e.shape),
    o = n.length ? n : H$,
    r = o.length ? [...t, ...o] : t;
  for (let a of r)
    if (!e.shape?.[a]?._zod?.traits?.has("$ZodType"))
      throw new Error(
        `Invalid element at key "${String(a)}": expected a Zod schema`,
      );
  let i = Aa(e.shape);
  return {
    ...e,
    allKeys: r,
    symbolKeys: o,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(i),
  };
}
function tp(e, t, n, o, r, i, a) {
  let s = [],
    c = r.keySet,
    u = r.catchall._zod,
    l = u.def.type,
    d = u.optin,
    f = u.optout,
    m = 0;
  for (let v in t) {
    if (a && n.issues.length !== m) {
      if (fe(n, m)) break;
      m = n.issues.length;
    }
    if (c.has(v)) continue;
    if (v === "__proto__") {
      l === "never" && s.push(v);
      continue;
    }
    if (l === "never") {
      s.push(v);
      continue;
    }
    let _ = u.run({ value: t[v], issues: [] }, o);
    _ instanceof Promise
      ? e.push(_.then((S) => Ui(S, n, v, t, d, f)))
      : Ui(_, n, v, t, d, f);
  }
  return (
    s.length &&
      n.issues.push({
        code: "unrecognized_keys",
        keys: s,
        input: t,
        inst: i,
        continue: !0,
      }),
    e.length ? Promise.all(e).then(() => n) : n
  );
}
var rp = p("$ZodObject", (e, t) => {
    C.init(e, t);
    let n = Object.getOwnPropertyDescriptor(t, "shape"),
      o = n?.get ? n.get.raw : (t.shape ?? {});
    if (o) {
      let u = () => {
        let l = { ...o };
        return (
          Object.defineProperty(t, "shape", { value: l }),
          (u.raw = l),
          l
        );
      };
      ((u.raw = o), Object.defineProperty(t, "shape", { get: u }));
    }
    let r = Bt(() => ep(t));
    V(e, "propValues", (u) => {
      let l = u.def.shape,
        d = {};
      for (let f in l) {
        let m = l[f]._zod;
        if (m.values) {
          Object.prototype.hasOwnProperty.call(d, f) || se(d, f, new Set());
          for (let v of m.values) d[f].add(v);
          m.optin !== void 0 && d[f].add(void 0);
        }
      }
      return d;
    });
    let i = _t,
      a = t.catchall,
      s,
      c = ae.memoizer;
    (c?.attach(e),
      (e._zod.parse = (u, l) => {
        s ?? (s = r.value);
        let d = u.value;
        if (!i(d))
          return (
            u.issues.push({
              expected: "object",
              code: "invalid_type",
              input: d,
              inst: e,
            }),
            u
          );
        u.value = c ? c.alloc(e, u, {}, l) : {};
        let f = [],
          m = s.shape,
          v = l?.abortEarly,
          _ = u.issues.length;
        for (let S of s.allKeys) {
          if (v && u.issues.length !== _) {
            if (fe(u, _)) break;
            _ = u.issues.length;
          }
          if (S === "__proto__") continue;
          let T = m[S],
            j = T._zod.optin,
            Z = T._zod.optout,
            B = T._zod.run({ value: d[S], issues: [] }, l);
          B instanceof Promise
            ? f.push(B.then((I) => Ui(I, u, S, d, j, Z)))
            : Ui(B, u, S, d, j, Z);
        }
        return a
          ? tp(f, d, u, l, r.value, e, v === !0)
          : f.length
            ? Promise.all(f).then(() => u)
            : u;
      }));
  }),
  Eu = p("$ZodObjectJIT", (e, t) => {
    rp.init(e, t);
    let n = e._zod.parse,
      o = Bt(() => ep(t)),
      r = ae.memoizer,
      i = (m) => {
        let v = o.value,
          _ = v.symbolKeys,
          S = new kt(["payload", "ctx"], {
            shape: m,
            inst: e,
            memo: r,
            syms: _,
          }),
          T = (I) =>
            `shape[${I}]._zod.run({ value: input[${I}], issues: [] }, ctx)`,
          j = (I, b) => `
          let ${I}_ab = false;
          for (let i = 0; i < ${I}.issues.length; i++) {
            const iss = ${I}.issues[i];
            iss.path = iss.path ? [${b}, ...iss.path] : [${b}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${I}_ab = true;
          }
          if (${I}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
        S.write("const input = payload.value;");
        let Z = Object.create(null),
          B = 0;
        for (let I of v.allKeys) Z[I] = `key_${B++}`;
        S.write(
          r
            ? "const newResult = memo.alloc(inst, payload, {}, ctx);"
            : "const newResult = {};",
        );
        for (let I of v.allKeys) {
          if (I === "__proto__") continue;
          let b = Z[I],
            D = typeof I == "symbol" ? `syms[${_.indexOf(I)}]` : de(I),
            ee = `${D} in input`,
            re = m[I],
            Pe = re?._zod?.optin,
            si = Pe !== void 0,
            xa = re?._zod?.optout === "optional";
          if ((S.write(`const ${b} = ${T(D)};`), si && xa)) {
            let ka =
              Pe === "optional"
                ? `${b}_present`
                : `${b}.value !== undefined || ${b}_present`;
            S.write(`
        const ${b}_present = ${ee};
        if (!${b}.issues.length || ${b}_present) {
          if (${b}.issues.length) {${j(b, D)}
          }

          if (${ka}) {
            newResult[${D}] = ${b}.value;
          }
        }

      `);
          } else
            si
              ? (S.write(`
        if (${b}.issues.length) {${j(b, D)}
        }
      `),
                Pe === "defaulted"
                  ? S.write(`newResult[${D}] = ${b}.value;`)
                  : S.write(`
        if (${b}.value !== undefined || ${ee}) {
          newResult[${D}] = ${b}.value;
        }
      `))
              : S.write(`
        const ${b}_present = ${ee};
        if (${b}.issues.length) {${j(b, D)}
        }
        if (!${b}_present && !${b}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${D}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${b}_present) {
          newResult[${D}] = ${b}.value;
        }

      `);
        }
        return (
          S.write("payload.value = newResult;"),
          S.write("return payload;"),
          S.compile()
        );
      },
      a,
      s = _t,
      c = !ae.jitless,
      l = c && Na.value,
      d = t.catchall,
      f;
    e._zod.parse = (m, v) => {
      f ?? (f = o.value);
      let _ = m.value;
      return s(_)
        ? c && l && v?.async === !1 && v.jitless !== !0
          ? (a || (a = i(t.shape)),
            (m = a(m, v)),
            d ? tp([], _, m, v, f, e, v?.abortEarly === !0) : m)
          : n(m, v)
        : (m.issues.push({
            expected: "object",
            code: "invalid_type",
            input: _,
            inst: e,
          }),
          m);
    };
  });
function Cm(e, t, n, o) {
  for (let i of e) if (i.issues.length === 0) return ((t.value = i.value), t);
  let r = e.filter((i) => !fe(i));
  return r.length === 1
    ? ((t.value = r[0].value), r[0])
    : (t.issues.push({
        code: "invalid_union",
        input: t.value,
        inst: n,
        errors: e.map((i) => i.issues.map((a) => $e(a, o, te()))),
      }),
      t);
}
var hn = p("$ZodUnion", (e, t) => {
  (C.init(e, t),
    V(e, "optin", (o) =>
      o.def.options.some((r) => r._zod.optin === "defaulted")
        ? "defaulted"
        : o.def.options.some((r) => r._zod.optin !== void 0)
          ? "optional"
          : void 0,
    ),
    V(e, "optout", (o) =>
      o.def.options.some((r) => r._zod.optout === "optional")
        ? "optional"
        : void 0,
    ),
    V(e, "values", (o) => {
      if (o.def.options.every((r) => r._zod.values))
        return new Set(o.def.options.flatMap((r) => Array.from(r._zod.values)));
    }),
    V(e, "pattern", (o) => {
      if (o.def.options.every((r) => r._zod.pattern)) {
        let r = o.def.options.map((i) => i._zod.pattern);
        return new RegExp(`^(${r.map((i) => Ge(i.source)).join("|")})$`);
      }
    }));
  let n = t.options.length === 1 ? t.options[0]._zod.run : null;
  e._zod.parse = (o, r) => {
    if (n) return n(o, r);
    let i = !1,
      a = [];
    for (let s of t.options) {
      let c = s._zod.run({ value: o.value, issues: [] }, r);
      if (c instanceof Promise) (a.push(c), (i = !0));
      else {
        if (c.issues.length === 0) return c;
        a.push(c);
      }
    }
    return i ? Promise.all(a).then((s) => Cm(s, o, e, r)) : Cm(a, o, e, r);
  };
});
function Lm(e, t, n, o) {
  let r = [];
  for (let i = 0; i < e.length; i++) e[i].issues.length === 0 && r.push(i);
  return r.length === 1
    ? ((t.value = e[r[0]].value), t)
    : (r.length === 0
        ? t.issues.push({
            code: "invalid_union",
            input: t.value,
            inst: n,
            errors: e.map((i) => i.issues.map((a) => $e(a, o, te()))),
          })
        : t.issues.push({
            code: "invalid_union",
            input: t.value,
            inst: n,
            errors: [],
            inclusive: !1,
            matches: r,
          }),
      t);
}
var Zu = p("$ZodXor", (e, t) => {
  (hn.init(e, t), (t.inclusive = !1));
  let n = t.options.length === 1 ? t.options[0]._zod.run : null;
  e._zod.parse = (o, r) => {
    if (n) return n(o, r);
    let i = !1,
      a = [];
    for (let s of t.options) {
      let c = s._zod.run({ value: o.value, issues: [] }, r);
      c instanceof Promise ? (a.push(c), (i = !0)) : a.push(c);
    }
    return i ? Promise.all(a).then((s) => Lm(s, o, e, r)) : Lm(a, o, e, r);
  };
});
function Cu(e, t) {
  let n = e._zod,
    o = n.bag.optionsMap;
  o || ((o = np(n.def)), (n.bag.optionsMap = o));
  let r = o.get(t);
  if (r === null)
    throw new Error(`Ambiguous discriminator value "${String(t)}"`);
  return r;
}
function np(e) {
  let t = new Map();
  for (let n of e.options) {
    let o = n._zod.propValues?.[e.discriminator];
    if (!o || o.size === 0)
      throw new Error(
        `Invalid discriminated union option at index "${e.options.indexOf(n)}"`,
      );
    for (let r of o)
      if (t.has(r)) {
        if (r !== void 0)
          throw new Error(`Duplicate discriminator value "${String(r)}"`);
        t.set(r, null);
      } else t.set(r, n);
  }
  return t;
}
var Lu = p("$ZodDiscriminatedUnion", (e, t) => {
    ((t.inclusive = !1), hn.init(e, t));
    let n = e._zod.parse;
    (V(e, "propValues", (r) => {
      let i = {},
        a = 0;
      for (let s of r.def.options) {
        let c = s._zod.propValues;
        if (!c || Object.keys(c).length === 0)
          throw new Error(
            `Invalid discriminated union option at index "${r.def.options.indexOf(s)}"`,
          );
        c[r.def.discriminator]?.has(void 0) && a++;
        for (let [u, l] of Object.entries(c)) {
          Object.prototype.hasOwnProperty.call(i, u) || se(i, u, new Set());
          for (let d of l) i[u].add(d);
        }
      }
      return (
        !r.def.unionFallback && a > 1 && i[r.def.discriminator]?.delete(void 0),
        i
      );
    }),
      t.options.forEach((r, i) => {
        let a = Kt(r._zod.def);
        if (a && !Object.prototype.hasOwnProperty.call(a, t.discriminator))
          throw new Error(`Invalid discriminated union option at index "${i}"`);
      }));
    let o = Bt(() => np(t));
    e._zod.parse = (r, i) => {
      let a = r.value;
      if (!_t(a))
        return (
          r.issues.push({
            code: "invalid_type",
            expected: "object",
            input: a,
            inst: e,
          }),
          r
        );
      let s = a?.[t.discriminator],
        c = o.value.get(s);
      return c && (s !== void 0 || i.direction !== "backward")
        ? c._zod.run(r, i)
        : t.unionFallback || i.direction === "backward"
          ? n(r, i)
          : (r.issues.push({
              code: "invalid_union",
              errors: [],
              note: "No matching discriminator",
              discriminator: t.discriminator,
              options: Array.from(o.value.keys()).filter(
                (u) => o.value.get(u) !== null,
              ),
              input: a,
              path: [t.discriminator],
              inst: e,
            }),
            r);
    };
  }),
  Ru = p("$ZodIntersection", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) => {
        let r = n.value,
          i = t.left._zod.run({ value: r, issues: [] }, o),
          a = t.right._zod.run({ value: r, issues: [] }, o);
        return i instanceof Promise || a instanceof Promise
          ? Promise.all([i, a]).then(([c, u]) => Rm(n, c, u))
          : Rm(n, i, a);
      }));
  });
function er(e, t) {
  if (e === t) return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (Oe(e) && Oe(t)) {
    let n = Object.keys(t),
      o = Object.keys(e).filter((i) => n.indexOf(i) !== -1),
      r = { ...e, ...t };
    Object.prototype.hasOwnProperty.call(r, "__proto__") && delete r.__proto__;
    for (let i of o) {
      if (i === "__proto__") continue;
      let a = er(e[i], t[i]);
      if (!a.valid)
        return { valid: !1, mergeErrorPath: [i, ...a.mergeErrorPath] };
      r[i] = a.data;
    }
    return { valid: !0, data: r };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return { valid: !1, mergeErrorPath: [] };
    let n = [];
    for (let o = 0; o < e.length; o++) {
      let r = e[o],
        i = t[o],
        a = er(r, i);
      if (!a.valid)
        return { valid: !1, mergeErrorPath: [o, ...a.mergeErrorPath] };
      n.push(a.data);
    }
    return { valid: !0, data: n };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Rm(e, t, n) {
  let o = new Map(),
    r,
    i = new Map(),
    a = (u, l) => {
      let d;
      if (u.code === "unrecognized_keys" && !u.path?.length)
        (r ?? (r = u), (d = u.keys));
      else if (
        u.code === "invalid_key" &&
        u.origin === "record" &&
        u.path?.length === 1
      ) {
        let f = String(u.path[0]);
        (i.has(f) || i.set(f, u), (d = [f]));
      } else return !1;
      for (let f of d) (o.has(f) || o.set(f, {}), (o.get(f)[l] = !0));
      return !0;
    };
  for (let u of t.issues) a(u, "l") || e.issues.push(u);
  for (let u of n.issues) a(u, "r") || e.issues.push(u);
  let s = [...o].filter(([, u]) => u.l && u.r).map(([u]) => u);
  if (s.length) {
    let u = r ? s.filter((l) => r.keys.includes(l)) : [];
    u.length && e.issues.push({ ...r, keys: u });
    for (let l of s) !u.includes(l) && i.has(l) && e.issues.push(i.get(l));
  }
  let c = er(t.value, n.value);
  if (!c.valid) {
    if (fe(e)) return e;
    throw new Error(
      `Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`,
    );
  }
  return ((e.value = c.data), e);
}
var Gi = p("$ZodTuple", (e, t) => {
  C.init(e, t);
  let n = t.items,
    o = ae.memoizer;
  (o?.attach(e),
    (e._zod.parse = (r, i) => {
      let a = r.value;
      if (!Array.isArray(a))
        return (
          r.issues.push({
            input: a,
            inst: e,
            expected: "tuple",
            code: "invalid_type",
          }),
          r
        );
      r.value = o ? o.alloc(e, r, [], i) : [];
      let s = [],
        c = Vm(n, "optin"),
        u = Vm(n, "optout");
      if (!t.rest) {
        if (a.length < c)
          return (
            r.issues.push({
              code: "too_small",
              minimum: c,
              inclusive: !0,
              input: a,
              inst: e,
              origin: "array",
            }),
            r
          );
        a.length > n.length &&
          r.issues.push({
            code: "too_big",
            maximum: n.length,
            inclusive: !0,
            input: a,
            inst: e,
            origin: "array",
          });
      }
      let l = new Array(n.length),
        d = t.rest ? i?.abortEarly : void 0,
        f = !1;
      for (let m = 0; m < n.length; m++) {
        let v = n[m]._zod.run({ value: a[m], issues: [] }, i);
        v instanceof Promise
          ? s.push(
              v.then((_) => {
                l[m] = _;
              }),
            )
          : ((l[m] = v), d && !f && v.issues.length && (f = fe(v)));
      }
      if (t.rest && !f) {
        let m = n.length - 1,
          v = a.slice(n.length),
          _ = r.issues.length;
        for (let S of v) {
          if (d && r.issues.length !== _) {
            if (fe(r, _)) break;
            _ = r.issues.length;
          }
          m++;
          let T = t.rest._zod.run({ value: S, issues: [] }, i);
          T instanceof Promise
            ? s.push(T.then((j) => Fm(j, r, m)))
            : Fm(T, r, m);
        }
      }
      return s.length
        ? Promise.all(s).then(() => Mm(l, r, n, a, u))
        : Mm(l, r, n, a, u);
    }));
});
function Vm(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (
      !(t === "optin"
        ? e[n]._zod.optin !== void 0
        : e[n]._zod.optout === "optional")
    )
      return n + 1;
  return 0;
}
function Fm(e, t, n) {
  (e.issues.length && t.issues.push(...ye(n, e.issues)),
    (t.value[n] = e.value));
}
function Mm(e, t, n, o, r) {
  for (let i = 0; i < n.length; i++) {
    let a = e[i],
      s = i < o.length;
    if (!s && i >= r && n[i]._zod.optin === "optional") {
      t.value.length = i;
      break;
    }
    if (a.issues.length) {
      if (!s && i >= r) {
        t.value.length = i;
        break;
      }
      t.issues.push(...ye(i, a.issues));
    }
    t.value[i] = a.value;
  }
  for (
    let i = t.value.length - 1;
    i >= o.length && n[i]._zod.optout === "optional" && t.value[i] === void 0;
    i--
  )
    t.value.length = i;
  return t;
}
var Vu = p("$ZodRecord", (e, t) => {
    C.init(e, t);
    let n = ae.memoizer;
    (n?.attach(e),
      (e._zod.parse = (o, r) => {
        let i = o.value;
        if (!Oe(i))
          return (
            o.issues.push({
              expected: "record",
              code: "invalid_type",
              input: i,
              inst: e,
            }),
            o
          );
        let a = [],
          s = t.keyType._zod.values;
        if (s && !t.partial) {
          o.value = n ? n.alloc(e, o, {}, r) : {};
          let c = new Set();
          for (let l of s)
            if (
              typeof l == "string" ||
              typeof l == "number" ||
              typeof l == "symbol"
            ) {
              if (
                (c.add(typeof l == "number" ? l.toString() : l),
                l === "__proto__")
              )
                continue;
              let d = t.keyType._zod.run({ value: l, issues: [] }, r);
              if (d instanceof Promise)
                throw new Error(
                  "Async schemas not supported in object keys currently",
                );
              if (d.issues.length) {
                o.issues.push({
                  code: "invalid_key",
                  origin: "record",
                  issues: d.issues.map((v) => $e(v, r, te())),
                  input: l,
                  path: [l],
                  inst: e,
                });
                continue;
              }
              let f = d.value;
              if (f === "__proto__") continue;
              let m = t.valueType._zod.run({ value: i[l], issues: [] }, r);
              m instanceof Promise
                ? a.push(
                    m.then((v) => {
                      (v.issues.length && o.issues.push(...ye(l, v.issues)),
                        (o.value[f] = v.value));
                    }),
                  )
                : (m.issues.length && o.issues.push(...ye(l, m.issues)),
                  (o.value[f] = m.value));
            }
          let u;
          for (let l in i)
            if (!c.has(l))
              if (t.mode === "loose") {
                if (l === "__proto__") continue;
                o.value[l] = i[l];
              } else ((u = u ?? []), u.push(l));
          u &&
            u.length > 0 &&
            o.issues.push({
              code: "unrecognized_keys",
              input: i,
              inst: e,
              keys: u,
              continue: !0,
            });
        } else {
          o.value = n ? n.alloc(e, o, {}, r) : {};
          let c;
          for (let u of Reflect.ownKeys(i)) {
            if (
              u === "__proto__" ||
              !Object.prototype.propertyIsEnumerable.call(i, u)
            )
              continue;
            let l = t.keyType._zod.run({ value: u, issues: [] }, r);
            if (l instanceof Promise)
              throw new Error(
                "Async schemas not supported in object keys currently",
              );
            if (typeof u == "string" && qe.test(u) && l.issues.length) {
              let v = t.keyType._zod.run({ value: Number(u), issues: [] }, r);
              if (v instanceof Promise)
                throw new Error(
                  "Async schemas not supported in object keys currently",
                );
              v.issues.length === 0 && (l = v);
            }
            if (l.issues.length) {
              t.mode === "loose"
                ? (o.value[u] = i[u])
                : s
                  ? ((c = c ?? []), c.push(u))
                  : o.issues.push({
                      code: "invalid_key",
                      origin: "record",
                      issues: l.issues.map((v) => $e(v, r, te())),
                      input: u,
                      path: [u],
                      inst: e,
                    });
              continue;
            }
            let f = l.value;
            if (f === "__proto__") continue;
            let m = t.valueType._zod.run({ value: i[u], issues: [] }, r);
            m instanceof Promise
              ? a.push(
                  m.then((v) => {
                    (v.issues.length && o.issues.push(...ye(u, v.issues)),
                      (o.value[f] = v.value));
                  }),
                )
              : (m.issues.length && o.issues.push(...ye(u, m.issues)),
                (o.value[f] = m.value));
          }
          c &&
            c.length > 0 &&
            o.issues.push({
              code: "unrecognized_keys",
              input: i,
              inst: e,
              keys: c,
              continue: !0,
            });
        }
        return a.length ? Promise.all(a).then(() => o) : o;
      }));
  }),
  Fu = p("$ZodMap", (e, t) => {
    C.init(e, t);
    let n = ae.memoizer;
    (n?.attach(e),
      (e._zod.parse = (o, r) => {
        let i = o.value;
        if (!(i instanceof Map))
          return (
            o.issues.push({
              expected: "map",
              code: "invalid_type",
              input: i,
              inst: e,
            }),
            o
          );
        let a = [];
        o.value = n ? n.alloc(e, o, new Map(), r) : new Map();
        let s = r?.abortEarly,
          c = o.issues.length;
        for (let [u, l] of i) {
          if (s && o.issues.length !== c) {
            if (fe(o, c)) break;
            c = o.issues.length;
          }
          let d = t.keyType._zod.run({ value: u, issues: [] }, r),
            f = t.valueType._zod.run({ value: l, issues: [] }, r);
          d instanceof Promise || f instanceof Promise
            ? a.push(
                Promise.all([d, f]).then(([m, v]) => {
                  Jm(m, v, o, u, i, e, r);
                }),
              )
            : Jm(d, f, o, u, i, e, r);
        }
        return a.length ? Promise.all(a).then(() => o) : o;
      }),
      Du(e, q$));
  });
function Jm(e, t, n, o, r, i, a) {
  (e.issues.length &&
    (qr.has(typeof o)
      ? n.issues.push(...ye(o, e.issues))
      : n.issues.push({
          code: "invalid_key",
          origin: "map",
          input: r,
          inst: i,
          issues: e.issues.map((s) => $e(s, a, te())),
        })),
    t.issues.length &&
      (qr.has(typeof o)
        ? n.issues.push(...ye(o, t.issues))
        : n.issues.push({
            origin: "map",
            code: "invalid_element",
            input: r,
            inst: i,
            key: o,
            issues: t.issues.map((s) => $e(s, a, te())),
          })),
    n.value.set(e.value, t.value));
}
var Mu = p("$ZodSet", (e, t) => {
  C.init(e, t);
  let n = ae.memoizer;
  (n?.attach(e),
    (e._zod.parse = (o, r) => {
      let i = o.value;
      if (!(i instanceof Set))
        return (
          o.issues.push({
            input: i,
            inst: e,
            expected: "set",
            code: "invalid_type",
          }),
          o
        );
      let a = [];
      o.value = n ? n.alloc(e, o, new Set(), r) : new Set();
      let s = r?.abortEarly,
        c = o.issues.length;
      for (let u of i) {
        if (s && o.issues.length !== c) {
          if (fe(o, c)) break;
          c = o.issues.length;
        }
        let l = t.valueType._zod.run({ value: u, issues: [] }, r);
        l instanceof Promise ? a.push(l.then((d) => Bm(d, o))) : Bm(l, o);
      }
      return a.length ? Promise.all(a).then(() => o) : o;
    }),
    Du(e, X$));
});
function Bm(e, t) {
  (e.issues.length && t.issues.push(...e.issues), t.value.add(e.value));
}
var Ju = p("$ZodEnum", (e, t) => {
    C.init(e, t);
    let n = Mt(t.entries),
      o = new Set(n);
    ((e._zod.values = o),
      V(e, "pattern", (r) => {
        let i = Mt(r.def.entries).filter((a) => qr.has(typeof a));
        return new RegExp(
          i.length
            ? `^(${i.map((a) => je(a.toString())).join("|")})$`
            : "^[^\\s\\S]$",
        );
      }),
      (e._zod.parse = (r, i) => {
        let a = r.value;
        return (
          o.has(a) ||
            r.issues.push({
              code: "invalid_value",
              values: n,
              input: a,
              inst: e,
            }),
          r
        );
      }));
  }),
  Bu = p("$ZodLiteral", (e, t) => {
    C.init(e, t);
    let n = new Set(t.values);
    ((e._zod.values = n),
      V(e, "pattern", (o) => {
        let r = o.def.values;
        return new RegExp(
          r.length
            ? `^(${r.map((i) => (typeof i == "string" ? je(i) : i ? je(i.toString()) : String(i))).join("|")})$`
            : "^[^\\s\\S]$",
        );
      }),
      (e._zod.parse = (o, r) => {
        let i = o.value;
        return (
          n.has(i) ||
            o.issues.push({
              code: "invalid_value",
              values: t.values,
              input: i,
              inst: e,
            }),
          o
        );
      }));
  }),
  Ku = p("$ZodFile", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) => {
        let r = n.value;
        return (
          r instanceof File ||
            n.issues.push({
              expected: "file",
              code: "invalid_type",
              input: r,
              inst: e,
            }),
          n
        );
      }));
  }),
  Wu = p("$ZodTransform", (e, t) => {
    (C.init(e, t),
      (e._zod.optin = "optional"),
      ae.memoizer?.guard(e),
      (e._zod.parse = (n, o) => {
        if (o.direction === "backward") throw new ot(e.constructor.name);
        let r = t.transform(n.value, n);
        if (o.async)
          return (r instanceof Promise ? r : Promise.resolve(r)).then(
            (a) => ((n.value = a), n),
          );
        if (r instanceof Promise) throw new _e();
        return ((n.value = r), n);
      }));
  });
function Km(e, t) {
  return ((e.value = t.issues.length ? void 0 : t.value), e);
}
var qi = p("$ZodOptional", (e, t) => {
    (C.init(e, t),
      V(e, "optin", (n) =>
        n.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional",
      ),
      (e._zod.optout = "optional"),
      V(e, "values", (n) => {
        let o = n.def.innerType._zod.values;
        return o ? new Set([...o, void 0]) : void 0;
      }),
      V(e, "pattern", (n) => {
        let o = n.def.innerType._zod.pattern;
        return o ? new RegExp(`^(${Ge(o.source)})?$`) : void 0;
      }),
      (e._zod.parse = (n, o) => {
        if (n.value === void 0) {
          if (t.innerType._zod.optin !== "defaulted") return n;
          let r = t.innerType._zod.run({ value: n.value, issues: [] }, o);
          return r instanceof Promise ? r.then((i) => Km(n, i)) : Km(n, r);
        }
        return t.innerType._zod.run(n, o);
      }));
  }),
  Gu = p("$ZodExactOptional", (e, t) => {
    (qi.init(e, t),
      V(e, "values", (n) => n.def.innerType._zod.values),
      V(e, "pattern", (n) => n.def.innerType._zod.pattern),
      (e._zod.parse = (n, o) => t.innerType._zod.run(n, o)));
  }),
  qu = p("$ZodNullable", (e, t) => {
    (C.init(e, t),
      V(e, "optin", (n) => n.def.innerType._zod.optin),
      V(e, "optout", (n) => n.def.innerType._zod.optout),
      V(e, "pattern", (n) => {
        let o = n.def.innerType._zod.pattern;
        return o ? new RegExp(`^(${Ge(o.source)}|null)$`) : void 0;
      }),
      V(e, "values", (n) =>
        n.def.innerType._zod.values
          ? new Set([...n.def.innerType._zod.values, null])
          : void 0,
      ),
      (e._zod.parse = (n, o) =>
        n.value === null ? n : t.innerType._zod.run(n, o)));
  }),
  Xu = p("$ZodDefault", (e, t) => {
    (C.init(e, t),
      (e._zod.optin = "defaulted"),
      V(e, "values", (n) => n.def.innerType._zod.values),
      (e._zod.parse = (n, o) => {
        if (o.direction === "backward") return t.innerType._zod.run(n, o);
        if (n.value === void 0) return ((n.value = t.defaultValue), n);
        let r = t.innerType._zod.run(n, o);
        return r instanceof Promise ? r.then((i) => Wm(i, t)) : Wm(r, t);
      }));
  });
function Wm(e, t) {
  return (e.value === void 0 && (e.value = t.defaultValue), e);
}
var Hu = p("$ZodPrefault", (e, t) => {
    (C.init(e, t),
      (e._zod.optin = "defaulted"),
      V(e, "values", (n) => n.def.innerType._zod.values),
      (e._zod.parse = (n, o) => (
        o.direction === "backward" ||
          (n.value === void 0 && (n.value = t.defaultValue)),
        t.innerType._zod.run(n, o)
      )));
  }),
  Yu = p("$ZodNonOptional", (e, t) => {
    (C.init(e, t),
      V(e, "values", (n) => {
        let o = n.def.innerType._zod.values;
        return o ? new Set([...o].filter((r) => r !== void 0)) : void 0;
      }),
      (e._zod.parse = (n, o) => {
        let r = t.innerType._zod.run(n, o);
        return r instanceof Promise ? r.then((i) => Gm(i, e)) : Gm(r, e);
      }));
  });
function Gm(e, t) {
  return (
    !e.issues.length &&
      e.value === void 0 &&
      e.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: e.value,
        inst: t,
      }),
    e
  );
}
var Qu = p("$ZodSuccess", (e, t) => {
  (C.init(e, t),
    (e._zod.parse = (n, o) => {
      if (o.direction === "backward") throw new ot("ZodSuccess");
      let r = t.innerType._zod.run(n, o);
      return r instanceof Promise
        ? r.then((i) => ((n.value = i.issues.length === 0), n))
        : ((n.value = r.issues.length === 0), n);
    }));
});
function qm(e, t, n, o) {
  return t.issues.length
    ? ((e.value = n.catchValue({
        ...t,
        value: e.value,
        error: { issues: t.issues.map((r) => $e(r, o, te())) },
        input: e.value,
      })),
      e)
    : ((e.value = t.value), t.memo && (e.memo = !0), e);
}
var ec = p("$ZodCatch", (e, t) => {
    (C.init(e, t),
      V(e, "optin", (n) =>
        n.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional",
      ),
      V(e, "optout", (n) => n.def.innerType._zod.optout),
      V(e, "values", (n) => n.def.innerType._zod.values),
      (e._zod.parse = (n, o) => {
        if (o.direction === "backward") return t.innerType._zod.run(n, o);
        let r = t.innerType._zod.run({ value: n.value, issues: [] }, o);
        return r instanceof Promise
          ? r.then((i) => qm(n, i, t, o))
          : qm(n, r, t, o);
      }));
  }),
  tc = p("$ZodNaN", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) => (
        (typeof n.value != "number" || !Number.isNaN(n.value)) &&
          n.issues.push({
            input: n.value,
            inst: e,
            expected: "nan",
            code: "invalid_type",
          }),
        n
      )));
  }),
  Xi = p("$ZodPipe", (e, t) => {
    (C.init(e, t),
      V(e, "values", (n) => n.def.in._zod.values),
      V(e, "optin", (n) => n.def.in._zod.optin),
      V(e, "optout", (n) => n.def.out._zod.optout),
      V(e, "propValues", (n) => n.def.in._zod.propValues),
      (e._zod.parse = (n, o) => {
        if (o.direction === "backward") {
          let i = t.out._zod.run(n, o);
          return i instanceof Promise
            ? i.then((a) => Ti(a, t.in, o))
            : Ti(i, t.in, o);
        }
        let r = t.in._zod.run(n, o);
        return r instanceof Promise
          ? r.then((i) => Ti(i, t.out, o))
          : Ti(r, t.out, o);
      }));
  });
function Ti(e, t, n) {
  return e.issues.some((o) => o.code !== "unrecognized_keys")
    ? ((e.aborted = !0), e)
    : t._zod.run({ value: e.value, issues: e.issues }, n);
}
var yn = p("$ZodCodec", (e, t) => {
  (C.init(e, t),
    V(e, "values", (n) => n.def.in._zod.values),
    V(e, "optin", (n) => n.def.in._zod.optin),
    V(e, "optout", (n) => n.def.out._zod.optout),
    V(e, "propValues", (n) => n.def.in._zod.propValues),
    (e._zod.parse = (n, o) => {
      if ((o.direction || "forward") === "forward") {
        let i = t.in._zod.run(n, o);
        return i instanceof Promise ? i.then((a) => Ai(a, t, o)) : Ai(i, t, o);
      } else {
        let i = t.out._zod.run(n, o);
        return i instanceof Promise ? i.then((a) => Ai(a, t, o)) : Ai(i, t, o);
      }
    }));
});
function Ai(e, t, n) {
  if (e.issues.length) return ((e.aborted = !0), e);
  if ((n.direction || "forward") === "forward") {
    let r = t.transform(e.value, e);
    return r instanceof Promise
      ? r.then((i) => Di(e, i, t.out, n))
      : Di(e, r, t.out, n);
  } else {
    let r = t.reverseTransform(e.value, e);
    return r instanceof Promise
      ? r.then((i) => Di(e, i, t.in, n))
      : Di(e, r, t.in, n);
  }
}
function Di(e, t, n, o) {
  return e.issues.length
    ? ((e.aborted = !0), e)
    : n._zod.run({ value: t, issues: e.issues }, o);
}
var rc = p("$ZodPreprocess", (e, t) => {
    Xi.init(e, t);
  }),
  nc = p("$ZodReadonly", (e, t) => {
    (C.init(e, t),
      V(e, "propValues", (n) => n.def.innerType._zod.propValues),
      V(e, "values", (n) => n.def.innerType._zod.values),
      V(e, "optin", (n) => n.def.innerType?._zod?.optin),
      V(e, "optout", (n) => n.def.innerType?._zod?.optout),
      (e._zod.parse = (n, o) => {
        if (o.direction === "backward") return t.innerType._zod.run(n, o);
        let r = t.innerType._zod.run(n, o);
        return r instanceof Promise ? r.then(Xm) : Xm(r);
      }));
  });
function Xm(e) {
  return (e.memo || (e.value = Object.freeze(e.value)), e);
}
function Y$(e) {
  let t = e._zod.def,
    n = t.pattern,
    o = !!t.format?.includes("int"),
    r,
    i;
  for (let s of t.checks ?? []) {
    let c = s._zod.def;
    (c.pattern && (n = c.pattern), o || (o = !!c.format?.includes("int")));
    let u = c.minimum ?? c.length,
      l = c.maximum ?? c.length;
    (u !== void 0 && (r === void 0 || u > r) && (r = u),
      l !== void 0 && (i === void 0 || l < i) && (i = l));
  }
  if (n) return n.source;
  if (r !== void 0 && i !== void 0 && r > i) return "(?!)";
  if (r !== void 0 || i !== void 0)
    return ys({ minimum: r, maximum: i }).source;
  let a = e._zod.pattern;
  return (o && a === qe ? un : a)?.source;
}
function Gs(e) {
  let t = e._zod.def,
    n = e._zod.pattern?.source,
    o = t.innerType ?? e._zod.innerType;
  if (o) {
    let r = o._zod.pattern?.source,
      i = Gs(o);
    return n && r && i && i !== r ? n.replace(Ge(r), () => Ge(i)) : n;
  }
  if (t.options) {
    let r = t.options.map(Gs);
    if (r.every(Boolean)) return `^(${r.map((i) => Ge(i)).join("|")})$`;
  }
  return Y$(e);
}
var ic = p("$ZodTemplateLiteral", (e, t) => {
    C.init(e, t);
    let n = [];
    for (let o of t.parts)
      if (typeof o == "object" && o !== null) {
        let r = Gs(o);
        if (!r)
          throw new Error(
            `Invalid template literal part, no pattern found: ${[...o._zod.traits].shift()}`,
          );
        n.push(Ge(r));
      } else if (o === null || Ta.has(typeof o)) n.push(je(`${o}`));
      else throw new Error(`Invalid template literal part: ${o}`);
    ((e._zod.pattern = new RegExp(`^${n.join("")}$`)),
      (e._zod.parse = (o, r) =>
        typeof o.value != "string"
          ? (o.issues.push({
              input: o.value,
              inst: e,
              expected: "string",
              code: "invalid_type",
            }),
            o)
          : ((e._zod.pattern.lastIndex = 0),
            e._zod.pattern.test(o.value) ||
              o.issues.push({
                input: o.value,
                inst: e,
                code: "invalid_format",
                format: t.format ?? "template_literal",
                pattern: e._zod.pattern.source,
              }),
            o)));
  }),
  oc = p(
    "$ZodFunction",
    (e, t) => (
      C.init(e, t),
      Object.defineProperty(e, "_def", { value: t }),
      (e._zod.def = t),
      (e.implement = (n) => {
        if (typeof n != "function")
          throw new Error("implement() must be called with a function");
        return Object.defineProperty(
          function (...o) {
            let r = e._def.input ? vi(e._def.input, o) : o,
              i = Reflect.apply(n, this, r);
            return e._def.output ? vi(e._def.output, i) : i;
          },
          "_zod",
          { value: e._zod, enumerable: !1 },
        );
      }),
      (e.implementAsync = (n) => {
        if (typeof n != "function")
          throw new Error("implementAsync() must be called with a function");
        return Object.defineProperty(
          async function (...o) {
            let r = e._def.input ? await hi(e._def.input, o) : o,
              i = await Reflect.apply(n, this, r);
            return e._def.output ? await hi(e._def.output, i) : i;
          },
          "_zod",
          { value: e._zod, enumerable: !1 },
        );
      }),
      (e._zod.parse = (n, o) =>
        typeof n.value != "function"
          ? (n.issues.push({
              code: "invalid_type",
              expected: "function",
              input: n.value,
              inst: e,
            }),
            n)
          : (e._def.output && e._def.output._zod.def.type === "promise"
              ? (n.value = e.implementAsync(n.value))
              : (n.value = e.implement(n.value)),
            n)),
      (e.input = (...n) => {
        let o = e.constructor;
        return Array.isArray(n[0])
          ? new o({
              type: "function",
              input: new Gi({ type: "tuple", items: n[0], rest: n[1] }),
              output: e._def.output,
            })
          : new o({ type: "function", input: n[0], output: e._def.output });
      }),
      (e.output = (n) => {
        let o = e.constructor;
        return new o({ type: "function", input: e._def.input, output: n });
      }),
      e
    ),
  ),
  ac = p("$ZodPromise", (e, t) => {
    (C.init(e, t),
      (e._zod.parse = (n, o) =>
        Promise.resolve(n.value).then((r) =>
          t.innerType._zod.run({ value: r, issues: [] }, o),
        )));
  }),
  $n = p("$ZodLazy", (e, t) => {
    (C.init(e, t),
      Oa(e._zod, "innerType", () => {
        let n = t;
        return (
          n._cachedInner || (n._cachedInner = t.getter()),
          n._cachedInner
        );
      }),
      V(e, "pattern", (n) => n.innerType?._zod?.pattern),
      V(e, "propValues", (n) => n.innerType?._zod?.propValues),
      V(e, "optin", (n) => n.innerType?._zod?.optin ?? void 0),
      V(e, "optout", (n) => n.innerType?._zod?.optout ?? void 0),
      (e._zod.parse = (n, o) => e._zod.innerType._zod.run(n, o)));
  }),
  sc = p("$ZodCustom", (e, t) => {
    (Y.init(e, t),
      C.init(e, t),
      (e._zod.parse = (n, o) => n),
      (e._zod.check = (n) => {
        let o = n.value,
          r = t.fn(o);
        if (r instanceof Promise) return r.then((i) => Hm(i, n, o, e));
        Hm(r, n, o, e);
      }));
  });
function Hm(e, t, n, o) {
  if (!e) {
    let r = {
      code: "custom",
      input: n,
      inst: o,
      path: [...(o._zod.def.path ?? [])],
      continue: !o._zod.def.abort,
    };
    (o._zod.def.params && (r.params = o._zod.def.params), t.issues.push(Gt(r)));
  }
}
var eo = class extends Error {
    constructor() {
      (super("Cannot parse a reference cycle that closes through a transform"),
        (this.name = "ZodCyclicError"));
    }
  },
  cc = "~memo",
  op = [];
function ap(e) {
  return e !== null && typeof e == "object";
}
function uc(e) {
  return e.map((t) => (t.path ? { ...t, path: t.path.slice() } : { ...t }));
}
var sp = new WeakMap(),
  tr = 0,
  Qi = 1,
  _n = 2;
function bn(e, t, n) {
  let o = sp.get(e);
  if (o !== void 0) return o ? _n : tr;
  if (t.has(e)) return _n;
  t.add(e);
  let r = tr,
    i = (l) => {
      if (r !== _n && l?._zod) {
        let d = bn(l, t, n);
        d > r && (r = d);
      }
    },
    a = (l, d) => {
      let f = tr;
      for (let m of Reflect.ownKeys(l)) {
        let v = Object.getOwnPropertyDescriptor(l, m);
        if (d && !v.enumerable) continue;
        let _ = v.get ? Qi : v.value?._zod ? bn(v.value, t, n) : tr;
        _ > f && (f = _);
      }
      return f;
    },
    s = (l) => {
      l > r && (r = l);
    },
    c = e._zod.def,
    u = c.type;
  switch (u) {
    case "object": {
      let l = Kt(c);
      (s(l ? a(l, !0) : Qi), i(c.catchall));
      break;
    }
    case "array":
      i(c.element);
      break;
    case "tuple":
      for (let l of c.items) i(l);
      i(c.rest);
      break;
    case "record":
    case "map":
      (i(c.keyType), i(c.valueType));
      break;
    case "set":
      i(c.valueType);
      break;
    case "union":
      for (let l of c.options) i(l);
      break;
    case "intersection":
      (i(c.left), i(c.right));
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      i(c.innerType);
      break;
    case "pipe":
      (i(c.in), i(c.out));
      break;
    case "function":
      (i(c.input), i(c.output));
      break;
    case "lazy": {
      let l = c._cachedInner ?? (n ? e._zod.innerType : void 0);
      s(l ? bn(l, t, !1) : Qi);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default:
      for (let l in c) {
        let d = Object.getOwnPropertyDescriptor(c, l);
        if (!d || d.get) continue;
        let f = d.value;
        if (!(!f || typeof f != "object")) {
          if (f._zod) i(f);
          else if (Array.isArray(f)) for (let m of f) i(m);
        }
      }
  }
  return (t.delete(e), Q$(e, r));
}
function Q$(e, t) {
  return (t !== Qi && sp.set(e, t === _n), t);
}
function to(e) {
  return bn(e, new Set(), !0) !== tr;
}
function e_(e, t) {
  let n = e.buckets.get(t);
  return (n || ((n = new WeakMap()), e.buckets.set(t, n)), n);
}
var Hi,
  Yi = [],
  t_ = {
    alloc(e, t, n) {
      let o = Hi;
      if (!o) return n;
      Hi = void 0;
      let r = { value: n, issues: null };
      return (o.set(t.value, r), Yi.push(r), n);
    },
    guard(e) {
      var t;
      ((t = e._zod).deferred ?? (t.deferred = []),
        e._zod.deferred.push(() => {
          let n = e._zod.parse,
            o = (r, i) => {
              if (i.direction !== "backward" && ro(i, r.value)) throw new eo();
              return n(r, i);
            };
          ((e._zod.parse = o), e._zod.run === n && (e._zod.run = o));
        }));
    },
    attach(e) {
      var t;
      let n,
        o = !1,
        r,
        i;
      ((t = e._zod).deferred ?? (t.deferred = []),
        e._zod.deferred.push(() => {
          let a = e._zod.parse,
            s = (c, u) => {
              if (n === void 0) {
                let T = bn(e, new Set(), !1);
                if (T === tr)
                  return (
                    (e._zod.parse = a),
                    e._zod.run === s && (e._zod.run = a),
                    a(c, u)
                  );
                T === _n || o ? (n = !0) : (o = !0);
              }
              let l = c.value;
              if (!ap(l)) return a(c, u);
              let d = u[cc];
              d ||
                ((d = { buckets: new WeakMap(), backEdges: void 0 }),
                (u[cc] = d));
              let f;
              r === u ? (f = i) : ((f = e_(d, e)), (r = u), (i = f));
              let m = f.get(l);
              if (m)
                return (
                  (c.value = m.value),
                  m.issues
                    ? m.issues.length && c.issues.push(...uc(m.issues))
                    : ((c.memo = !0),
                      d.backEdges ?? (d.backEdges = new WeakSet()),
                      d.backEdges.add(m.value)),
                  c
                );
              Hi = f;
              let v = Yi.length,
                _ = a(c, u);
              Hi = void 0;
              let S = Yi.length > v ? Yi.pop() : void 0;
              return _ instanceof Promise
                ? _.then(
                    (T) => (
                      S && (S.issues = T.issues.length ? uc(T.issues) : op),
                      T
                    ),
                  )
                : (S && (S.issues = _.issues.length ? uc(_.issues) : op), _);
            };
          ((e._zod.parse = s), e._zod.run === a && (e._zod.run = s));
        }));
    },
  };
function xn() {
  return t_;
}
function ro(e, t) {
  let n = e[cc]?.backEdges;
  return n !== void 0 && ap(t) && n.has(t);
}
var wn = {};
Ke(wn, {
  ar: () => up,
  az: () => cp,
  be: () => dp,
  bg: () => fp,
  bn: () => mp,
  ca: () => pp,
  ckb: () => gp,
  cs: () => vp,
  da: () => hp,
  de: () => yp,
  el: () => $p,
  en: () => no,
  eo: () => _p,
  es: () => bp,
  fa: () => xp,
  fi: () => kp,
  fr: () => wp,
  frCA: () => Ip,
  gu: () => Sp,
  he: () => zp,
  hi: () => Pp,
  hr: () => Op,
  hu: () => jp,
  hy: () => Tp,
  id: () => Ap,
  is: () => Dp,
  it: () => Up,
  ja: () => Ep,
  ka: () => Zp,
  kh: () => Cp,
  km: () => io,
  kn: () => Lp,
  ko: () => Rp,
  lt: () => Fp,
  mk: () => Mp,
  ms: () => Jp,
  ne: () => Bp,
  nl: () => Kp,
  nn: () => Wp,
  no: () => Gp,
  ota: () => qp,
  pl: () => Hp,
  ps: () => Xp,
  pt: () => Yp,
  ptBR: () => Qp,
  ro: () => eg,
  ru: () => rg,
  sk: () => ng,
  sl: () => ig,
  sv: () => og,
  ta: () => ag,
  tg: () => sg,
  th: () => ug,
  tk: () => cg,
  tr: () => lg,
  ua: () => dg,
  uk: () => oo,
  ur: () => fg,
  uz: () => mg,
  vi: () => pg,
  yo: () => hg,
  zhCN: () => gg,
  zhTW: () => vg,
});
var r_ = () => {
  let e = {
    string: {
      unit: "\u062D\u0631\u0641",
      verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
    },
    file: {
      unit: "\u0628\u0627\u064A\u062A",
      verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
    },
    array: {
      unit: "\u0639\u0646\u0635\u0631",
      verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
    },
    set: {
      unit: "\u0639\u0646\u0635\u0631",
      verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
    },
    map: {
      unit: "\u0639\u0646\u0635\u0631",
      verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0645\u062F\u062E\u0644",
      email:
        "\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
      url: "\u0631\u0627\u0628\u0637",
      emoji: "\u0625\u064A\u0645\u0648\u062C\u064A",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      date: "\u062A\u0627\u0631\u064A\u062E \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      time: "\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      duration: "\u0645\u062F\u0629 \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      ipv4: "\u0639\u0646\u0648\u0627\u0646 IPv4",
      ipv6: "\u0639\u0646\u0648\u0627\u0646 IPv6",
      mac: "\u0639\u0646\u0648\u0627\u0646 MAC",
      cidrv4:
        "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv4",
      cidrv6:
        "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv6",
      base64:
        "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64-encoded",
      base64url:
        "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64url-encoded",
      json_string:
        "\u0646\u064E\u0635 \u0639\u0644\u0649 \u0647\u064A\u0626\u0629 JSON",
      e164: "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0628\u0645\u0639\u064A\u0627\u0631 E.164",
      credit_card:
        "\u0631\u0642\u0645 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0627\u0626\u062A\u0645\u0627\u0646",
      currency_code: "\u0631\u0645\u0632 \u0627\u0644\u0639\u0645\u0644\u0629",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0645\u062F\u062E\u0644",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 instanceof ${r.expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${s}`
          : `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${i}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${y(r.values[0])}`
          : `\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062A\u0648\u0642\u0639 \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u062D\u062F \u0647\u0630\u0647 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A: ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? ` \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${r.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${i} ${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0635\u0631"}`
          : `\u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${r.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${r.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${i} ${r.minimum.toString()} ${a.unit}`
          : `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${r.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0628\u062F\u0623 \u0628\u0640 "${r.prefix}"`
          : i.format === "ends_with"
            ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0646\u062A\u0647\u064A \u0628\u0640 "${i.suffix}"`
            : i.format === "includes"
              ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0636\u0645\u0651\u064E\u0646 "${i.includes}"`
              : i.format === "regex"
                ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0637\u0627\u0628\u0642 \u0627\u0644\u0646\u0645\u0637 ${i.pattern}`
                : `${n[i.format] ?? r.format} \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644`;
      }
      case "not_multiple_of":
        return `\u0631\u0642\u0645 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0645\u0646 \u0645\u0636\u0627\u0639\u0641\u0627\u062A ${r.divisor}`;
      case "unrecognized_keys":
        return `\u0645\u0639\u0631\u0641${r.keys.length > 1 ? "\u0627\u062A" : ""} \u063A\u0631\u064A\u0628${r.keys.length > 1 ? "\u0629" : ""}: ${g(r.keys, "\u060C ")}`;
      case "invalid_key":
        return `\u0645\u0639\u0631\u0641 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${r.origin}`;
      case "invalid_union":
        return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
      case "invalid_element":
        return `\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${r.origin}`;
      default:
        return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
    }
  };
};
function up() {
  return { localeError: r_() };
}
var n_ = () => {
  let e = {
    string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "element", verb: "olmal\u0131d\u0131r" },
    set: { unit: "element", verb: "olmal\u0131d\u0131r" },
    map: { unit: "element", verb: "olmal\u0131d\u0131r" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "input",
      email: "email address",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datetime",
      date: "ISO date",
      time: "ISO time",
      duration: "ISO duration",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      mac: "MAC address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded string",
      base64url: "base64url-encoded string",
      json_string: "JSON string",
      e164: "E.164 number",
      credit_card: "kredit kart\u0131 n\xF6mr\u0259si",
      currency_code: "valyuta kodu",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof ${r.expected}, daxil olan ${s}`
          : `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${i}, daxil olan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${y(r.values[0])}`
          : `Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${r.origin ?? "d\u0259y\u0259r"} ${i}${r.maximum.toString()} ${a.unit ?? "element"}`
          : `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${r.origin ?? "d\u0259y\u0259r"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${r.origin} ${i}${r.minimum.toString()} ${a.unit}`
          : `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Yanl\u0131\u015F m\u0259tn: "${i.prefix}" il\u0259 ba\u015Flamal\u0131d\u0131r`
          : i.format === "ends_with"
            ? `Yanl\u0131\u015F m\u0259tn: "${i.suffix}" il\u0259 bitm\u0259lidir`
            : i.format === "includes"
              ? `Yanl\u0131\u015F m\u0259tn: "${i.includes}" daxil olmal\u0131d\u0131r`
              : i.format === "regex"
                ? `Yanl\u0131\u015F m\u0259tn: ${i.pattern} \u015Fablonuna uy\u011Fun olmal\u0131d\u0131r`
                : `Yanl\u0131\u015F ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Yanl\u0131\u015F \u0259d\u0259d: ${r.divisor} il\u0259 b\xF6l\xFCn\u0259 bil\u0259n olmal\u0131d\u0131r`;
      case "unrecognized_keys":
        return `Tan\u0131nmayan a\xE7ar${r.keys.length > 1 ? "lar" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} daxilind\u0259 yanl\u0131\u015F a\xE7ar`;
      case "invalid_union":
        return "Yanl\u0131\u015F d\u0259y\u0259r";
      case "invalid_element":
        return `${r.origin} daxilind\u0259 yanl\u0131\u015F d\u0259y\u0259r`;
      default:
        return "Yanl\u0131\u015F d\u0259y\u0259r";
    }
  };
};
function cp() {
  return { localeError: n_() };
}
function lp(e, t, n, o) {
  let r = Math.abs(e),
    i = r % 10,
    a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
var i_ = () => {
  let e = {
    string: {
      unit: {
        one: "\u0441\u0456\u043C\u0432\u0430\u043B",
        few: "\u0441\u0456\u043C\u0432\u0430\u043B\u044B",
        many: "\u0441\u0456\u043C\u0432\u0430\u043B\u0430\u045E",
      },
      verb: "\u043C\u0435\u0446\u044C",
    },
    array: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
      },
      verb: "\u043C\u0435\u0446\u044C",
    },
    set: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
      },
      verb: "\u043C\u0435\u0446\u044C",
    },
    map: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
      },
      verb: "\u043C\u0435\u0446\u044C",
    },
    file: {
      unit: {
        one: "\u0431\u0430\u0439\u0442",
        few: "\u0431\u0430\u0439\u0442\u044B",
        many: "\u0431\u0430\u0439\u0442\u0430\u045E",
      },
      verb: "\u043C\u0435\u0446\u044C",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0443\u0432\u043E\u0434",
      email: "email \u0430\u0434\u0440\u0430\u0441",
      url: "URL",
      emoji: "\u044D\u043C\u043E\u0434\u0437\u0456",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0434\u0430\u0442\u0430 \u0456 \u0447\u0430\u0441",
      date: "ISO \u0434\u0430\u0442\u0430",
      time: "ISO \u0447\u0430\u0441",
      duration:
        "ISO \u043F\u0440\u0430\u0446\u044F\u0433\u043B\u0430\u0441\u0446\u044C",
      ipv4: "IPv4 \u0430\u0434\u0440\u0430\u0441",
      ipv6: "IPv6 \u0430\u0434\u0440\u0430\u0441",
      mac: "MAC \u0430\u0434\u0440\u0430\u0441",
      cidrv4: "IPv4 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
      cidrv6: "IPv6 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
      base64:
        "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64",
      base64url:
        "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64url",
      json_string: "JSON \u0440\u0430\u0434\u043E\u043A",
      e164: "\u043D\u0443\u043C\u0430\u0440 E.164",
      credit_card:
        "\u043D\u0443\u043C\u0430\u0440 \u043A\u0440\u044D\u0434\u044B\u0442\u043D\u0430\u0439 \u043A\u0430\u0440\u0442\u044B",
      currency_code: "\u043A\u043E\u0434 \u0432\u0430\u043B\u044E\u0442\u044B",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0443\u0432\u043E\u0434",
    },
    o = {
      nan: "NaN",
      number: "\u043B\u0456\u043A",
      array: "\u043C\u0430\u0441\u0456\u045E",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F instanceof ${r.expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${s}`
          : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F ${i}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F ${y(r.values[0])}`
          : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0432\u0430\u0440\u044B\u044F\u043D\u0442: \u0447\u0430\u043A\u0430\u045E\u0441\u044F \u0430\u0434\u0437\u0456\u043D \u0437 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        if (a) {
          let s = Number(r.maximum),
            c = lp(s, a.unit.one, a.unit.few, a.unit.many);
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${a.verb} ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        if (a) {
          let s = Number(r.minimum),
            c = lp(s, a.unit.one, a.unit.few, a.unit.many);
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${a.verb} ${i}${r.minimum.toString()} ${c}`;
        }
        return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${r.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u043F\u0430\u0447\u044B\u043D\u0430\u0446\u0446\u0430 \u0437 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0432\u0430\u0446\u0446\u0430 \u043D\u0430 "${i.suffix}"`
            : i.format === "includes"
              ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u043C\u044F\u0448\u0447\u0430\u0446\u044C "${i.includes}"`
              : i.format === "regex"
                ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0430\u0434\u043F\u0430\u0432\u044F\u0434\u0430\u0446\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}`
                : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043B\u0456\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0431\u044B\u0446\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u0430\u0441\u043F\u0430\u0437\u043D\u0430\u043D\u044B ${r.keys.length > 1 ? "\u043A\u043B\u044E\u0447\u044B" : "\u043A\u043B\u044E\u0447"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043A\u043B\u044E\u0447 \u0443 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
      case "invalid_element":
        return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u0430\u0435 \u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435 \u045E ${r.origin}`;
      default:
        return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
    }
  };
};
function dp() {
  return { localeError: i_() };
}
var o_ = () => {
  let e = {
    string: {
      unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
      verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
    },
    file: {
      unit: "\u0431\u0430\u0439\u0442\u0430",
      verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
    },
    array: {
      unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
      verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
    },
    set: {
      unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
      verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
    },
    map: {
      unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
      verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0432\u0445\u043E\u0434",
      email: "\u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441",
      url: "URL",
      emoji: "\u0435\u043C\u043E\u0434\u0436\u0438",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0432\u0440\u0435\u043C\u0435",
      date: "ISO \u0434\u0430\u0442\u0430",
      time: "ISO \u0432\u0440\u0435\u043C\u0435",
      duration:
        "ISO \u043F\u0440\u043E\u0434\u044A\u043B\u0436\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442",
      ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
      ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
      mac: "MAC \u0430\u0434\u0440\u0435\u0441",
      cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      base64:
        "base64-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
      base64url:
        "base64url-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
      json_string: "JSON \u043D\u0438\u0437",
      e164: "E.164 \u043D\u043E\u043C\u0435\u0440",
      credit_card:
        "\u043D\u043E\u043C\u0435\u0440 \u043D\u0430 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u0430 \u043A\u0430\u0440\u0442\u0430",
      currency_code:
        "\u043A\u043E\u0434 \u043D\u0430 \u0432\u0430\u043B\u0443\u0442\u0430",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0432\u0445\u043E\u0434",
    },
    o = {
      nan: "NaN",
      number: "\u0447\u0438\u0441\u043B\u043E",
      array: "\u043C\u0430\u0441\u0438\u0432",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D instanceof ${r.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${s}`
          : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${y(r.values[0])}`
          : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u043E\u043F\u0446\u0438\u044F: \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u043E \u0435\u0434\u043D\u043E \u043E\u0442 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${i}${r.maximum.toString()} ${a.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430"}`
          : `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0431\u044A\u0434\u0435 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${i}${r.minimum.toString()} ${a.unit}`
          : `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${r.origin} \u0434\u0430 \u0431\u044A\u0434\u0435 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        if (i.format === "starts_with")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u0432\u0430 \u0441 "${i.prefix}"`;
        if (i.format === "ends_with")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u0432\u044A\u0440\u0448\u0432\u0430 \u0441 "${i.suffix}"`;
        if (i.format === "includes")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0432\u0430 "${i.includes}"`;
        if (i.format === "regex")
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0441\u044A\u0432\u043F\u0430\u0434\u0430 \u0441 ${i.pattern}`;
        let a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D";
        return (
          i.format === "emoji" &&
            (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"),
          i.format === "datetime" &&
            (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"),
          i.format === "date" &&
            (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430"),
          i.format === "time" &&
            (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"),
          i.format === "duration" &&
            (a = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430"),
          `${a} ${n[i.format] ?? r.format}`
        );
      }
      case "not_multiple_of":
        return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E \u0447\u0438\u0441\u043B\u043E: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u0430\u0437\u043F\u043E\u0437\u043D\u0430\u0442${r.keys.length > 1 ? "\u0438" : ""} \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u043E\u0432\u0435" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043A\u043B\u044E\u0447 \u0432 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
      case "invalid_element":
        return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442 \u0432 ${r.origin}`;
      default:
        return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
    }
  };
};
function fp() {
  return { localeError: o_() };
}
var a_ = () => {
  let e = {
    string: {
      unit: "\u0985\u0995\u09CD\u09B7\u09B0",
      verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
    },
    file: {
      unit: "\u09AC\u09BE\u0987\u099F",
      verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
    },
    array: {
      unit: "\u0986\u0987\u099F\u09C7\u09AE",
      verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
    },
    set: {
      unit: "\u0986\u0987\u099F\u09C7\u09AE",
      verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
    },
    map: {
      unit: "\u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF",
      verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0987\u09A8\u09AA\u09C1\u099F",
      email:
        "\u0987\u09AE\u09C7\u0987\u09B2 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
      url: "URL",
      emoji: "\u0987\u09AE\u09CB\u099C\u09BF",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u09A4\u09BE\u09B0\u09BF\u0996 \u0993 \u09B8\u09AE\u09AF\u09BC",
      date: "ISO \u09A4\u09BE\u09B0\u09BF\u0996",
      time: "ISO \u09B8\u09AE\u09AF\u09BC",
      duration: "ISO \u09B8\u09AE\u09AF\u09BC\u0995\u09BE\u09B2",
      ipv4: "IPv4 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
      ipv6: "IPv6 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
      mac: "MAC \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
      cidrv4: "IPv4 \u09B0\u09C7\u099E\u09CD\u099C",
      cidrv6: "IPv6 \u09B0\u09C7\u099E\u09CD\u099C",
      base64:
        "base64-\u098F\u09A8\u0995\u09CB\u09A1\u09C7\u09A1 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
      base64url:
        "base64url-\u098F\u09A8\u0995\u09CB\u09A1\u09C7\u09A1 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
      json_string: "JSON \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
      e164: "E.164 \u09A8\u09AE\u09CD\u09AC\u09B0",
      credit_card:
        "\u0995\u09CD\u09B0\u09C7\u09A1\u09BF\u099F \u0995\u09BE\u09B0\u09CD\u09A1 \u09A8\u09AE\u09CD\u09AC\u09B0",
      currency_code: "\u09AE\u09C1\u09A6\u09CD\u09B0\u09BE \u0995\u09CB\u09A1",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0987\u09A8\u09AA\u09C1\u099F",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F: \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ${i}, \u09AA\u09CD\u09B0\u09BE\u09AA\u09CD\u09A4 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F: \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ${y(r.values[0])}`
          : `\u0985\u09AC\u09C8\u09A7 \u0985\u09AA\u09B6\u09A8: ${g(r.values, " | ")} \u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u098F\u0995\u099F\u09BF \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0985\u09A8\u09C7\u0995 \u09AC\u09A1\u09BC: ${r.origin ?? "\u09AE\u09BE\u09A8"} ${i}${r.maximum.toString()} ${a.unit ?? "\u098F\u09B2\u09BF\u09AE\u09C7\u09A8\u09CD\u099F"} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
          : `\u0985\u09A8\u09C7\u0995 \u09AC\u09A1\u09BC: ${r.origin ?? "\u09AE\u09BE\u09A8"} ${i}${r.maximum.toString()} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0985\u09A8\u09C7\u0995 \u099B\u09CB\u099F: ${r.origin} ${i}${r.minimum.toString()} ${a.unit} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
          : `\u0985\u09A8\u09C7\u0995 \u099B\u09CB\u099F: ${r.origin} ${i}${r.minimum.toString()} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "${i.prefix}" \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C1\u09B0\u09C1 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
          : i.format === "ends_with"
            ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "${i.suffix}" \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C7\u09B7 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
            : i.format === "includes"
              ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "${i.includes}" \u0985\u09A8\u09CD\u09A4\u09B0\u09CD\u09AD\u09C1\u0995\u09CD\u09A4 \u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7`
              : i.format === "regex"
                ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: ${i.pattern} \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09BF\u09B2\u09A4\u09C7 \u09B9\u09AC\u09C7`
                : `\u0985\u09AC\u09C8\u09A7 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0985\u09AC\u09C8\u09A7 \u09A8\u09AE\u09CD\u09AC\u09B0: ${r.divisor} \u098F\u09B0 \u0997\u09C1\u09A3\u09BF\u09A4\u0995 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`;
      case "unrecognized_keys":
        return `\u0985\u099A\u09C7\u09A8\u09BE \u0995\u09C0${r.keys.length > 1 ? "\u0997\u09C1\u09B2\u09CB" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} \u098F \u0985\u09AC\u09C8\u09A7 \u0995\u09C0`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0
          ? `\u0985\u09AC\u09C8\u09A7 \u09A1\u09BF\u09B8\u0995\u09CD\u09B0\u09BF\u09AE\u09BF\u09A8\u09C7\u099F\u09B0 \u09AE\u09BE\u09A8\u0964 \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ${r.options.map((a) => `'${a}'`).join(" | ")}`
          : "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F";
      case "invalid_element":
        return `${r.origin} \u098F \u0985\u09AC\u09C8\u09A7 \u09AE\u09BE\u09A8`;
      default:
        return "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F";
    }
  };
};
function mp() {
  return { localeError: a_() };
}
var s_ = () => {
  let e = {
    string: { unit: "car\xE0cters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" },
    map: { unit: "elements", verb: "contenir" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "entrada",
      email: "adre\xE7a electr\xF2nica",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "data i hora ISO",
      date: "data ISO",
      time: "hora ISO",
      duration: "durada ISO",
      ipv4: "adre\xE7a IPv4",
      ipv6: "adre\xE7a IPv6",
      mac: "adre\xE7a MAC",
      cidrv4: "rang IPv4",
      cidrv6: "rang IPv6",
      base64: "cadena codificada en base64",
      base64url: "cadena codificada en base64url",
      json_string: "cadena JSON",
      e164: "n\xFAmero E.164",
      credit_card: "n\xFAmero de targeta de cr\xE8dit",
      currency_code: "codi de moneda",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "entrada",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Tipus inv\xE0lid: s'esperava instanceof ${r.expected}, s'ha rebut ${s}`
          : `Tipus inv\xE0lid: s'esperava ${i}, s'ha rebut ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Valor inv\xE0lid: s'esperava ${y(r.values[0])}`
          : `Opci\xF3 inv\xE0lida: s'esperava una de ${g(r.values, " o ")}`;
      case "too_big": {
        let i = r.inclusive ? "com a m\xE0xim" : "menys de",
          a = t(r.origin);
        return a
          ? `Massa gran: s'esperava que ${r.origin ?? "el valor"} contingu\xE9s ${i} ${r.maximum.toString()} ${a.unit ?? "elements"}`
          : `Massa gran: s'esperava que ${r.origin ?? "el valor"} fos ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? "com a m\xEDnim" : "m\xE9s de",
          a = t(r.origin);
        return a
          ? `Massa petit: s'esperava que ${r.origin} contingu\xE9s ${i} ${r.minimum.toString()} ${a.unit}`
          : `Massa petit: s'esperava que ${r.origin} fos ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Format inv\xE0lid: ha de comen\xE7ar amb "${i.prefix}"`
          : i.format === "ends_with"
            ? `Format inv\xE0lid: ha d'acabar amb "${i.suffix}"`
            : i.format === "includes"
              ? `Format inv\xE0lid: ha d'incloure "${i.includes}"`
              : i.format === "regex"
                ? `Format inv\xE0lid: ha de coincidir amb el patr\xF3 ${i.pattern}`
                : `Format inv\xE0lid per a ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `N\xFAmero inv\xE0lid: ha de ser m\xFAltiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clau${r.keys.length > 1 ? "s" : ""} no reconeguda${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Clau inv\xE0lida a ${r.origin}`;
      case "invalid_union":
        return "Entrada inv\xE0lida";
      case "invalid_element":
        return `Element inv\xE0lid a ${r.origin}`;
      default:
        return "Entrada inv\xE0lida";
    }
  };
};
function pp() {
  return { localeError: s_() };
}
var u_ = () => {
  let e = {
    string: { unit: "\u067E\u06CC\u062A", verb: "\u0628\u06CE\u062A" },
    file: { unit: "\u0628\u0627\u06CC\u062A", verb: "\u0628\u06CE\u062A" },
    array: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
    set: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
    map: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "regex",
      email: "\u0626\u06CC\u0645\u06D5\u06CC\u06B5",
      url: "\u0628\u06D5\u0633\u062A\u06D5\u0631 (URL)",
      emoji: "\u0626\u06CC\u0645\u06C6\u062C\u06CC",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u0695\u06CE\u06A9\u06D5\u0648\u062A \u0648 \u06A9\u0627\u062A",
      date: "\u0695\u06CE\u06A9\u06D5\u0648\u062A",
      time: "\u06A9\u0627\u062A",
      duration: "\u0645\u0627\u0648\u06D5",
      ipv4: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC IPv4",
      ipv6: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC IPv6",
      mac: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC MAC",
      cidrv4: "\u0645\u06D5\u0648\u062F\u0627\u06CC IPv4",
      cidrv6: "\u0645\u06D5\u0648\u062F\u0627\u06CC IPv6",
      base64: "\u062F\u06D5\u0642\u06CC base64",
      base64url: "\u062F\u06D5\u0642\u06CC base64url",
      json_string: "\u062F\u06D5\u0642\u06CC JSON",
      e164: "\u0698\u0645\u0627\u0631\u06D5\u06CC E.164",
      credit_card:
        "\u0698\u0645\u0627\u0631\u06D5\u06CC \u06A9\u0627\u0631\u062A\u06CC \u06A9\u0631\u06CE\u062F\u06CC\u062A",
      currency_code: "\u06A9\u06C6\u062F\u06CC \u062F\u0631\u0627\u0648",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u062A\u06CE\u06A9\u0631\u062F\u06D5",
    },
    o = {
      nan: "NaN",
      string: "\u0646\u0648\u0648\u0633\u06CC\u0646",
      number: "\u0698\u0645\u0627\u0631\u06D5",
      boolean: "boolean",
      array: "array",
      object: "object",
      date: "\u0695\u06CE\u06A9\u06D5\u0648\u062A",
      integer: "\u0698\u0645\u0627\u0631\u06D5",
      float: "\u0698\u0645\u0627\u0631\u06D5",
      null: "null",
      undefined: "undefined",
      function: "function",
      symbol: "symbol",
      unknown: "unknown",
      promise: "promise",
      void: "void",
      never: "never",
      map: "map",
      set: "set",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a,
          c = [
            "\u0627",
            "\u0648",
            "\u06C6",
            "\u0648\u0648",
            "\u06D5",
            "\u06CC",
            "\u06CE",
          ].some((l) => s.endsWith(l))
            ? "\u06CC\u06D5"
            : "\u06D5",
          u = /^[a-zA-Z]+$/.test(s);
        return a === "null" || a === "undefined"
          ? "\u062F\u0627\u0648\u0627\u06A9\u0631\u0627\u0648\u06D5"
          : `\u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 ${i} \u0628\u06CE\u062A\u060C \u0628\u06D5\u06B5\u0627\u0645 ${s}${u ? "" : c}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0628\u06D5\u0647\u0627\u06A9\u06D5 \u0646\u0627\u062F\u0631\u0648\u0648\u0633\u062A\u06D5: \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 ${y(r.values[0])} \u0628\u06CE\u062A`
          : `\u0647\u06D5\u06B5\u0628\u0698\u0627\u0631\u062F\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 \u06CC\u06D5\u06A9\u06CE\u06A9 \u0628\u06CE\u062A \u0644\u06D5 ${g(r.values, "|")}`;
      case "too_big": {
        let i = t(r.origin);
        return i
          ? `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u0632\u06C6\u0631\u06D5\u0648\u06D5 ${r.maximum.toString()} ${i.unit} ${i.verb}`
          : `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u0632\u06C6\u0631\u06D5\u0648\u06D5 ${r.maximum.toString()} \u0628\u06CE\u062A`;
      }
      case "too_small": {
        let i = t(r.origin);
        return i
          ? `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u06A9\u06D5\u0645\u06D5\u0648\u06D5 ${r.minimum.toString()} ${i.unit} ${i.verb}`
          : `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u06A9\u06D5\u0645\u06D5\u0648\u06D5 ${r.minimum.toString()} \u0628\u06CE\u062A`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u062F\u06D5\u0633\u062A\u067E\u06CE\u0628\u06A9\u0627\u062A \u0628\u06D5 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u06A9\u06C6\u062A\u0627\u06CC\u06CC\u0628\u06CE\u062A \u0628\u06D5 "${i.suffix}"`
            : i.format === "includes"
              ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 "${i.includes}" \u0644\u06D5\u062E\u06C6\u0628\u06AF\u0631\u06CE\u062A`
              : i.format === "regex"
                ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0644\u06D5\u06AF\u06D5\u06B5 \u067E\u0627\u062A\u06CE\u0631\u0646\u06CC ${i.pattern} \u0628\u06AF\u0648\u0646\u062C\u06CE\u062A`
                : `\u0628\u06D5\u0647\u0627\u06CC ${n[i.format] ?? r.format} \u0646\u0627\u062F\u0631\u0648\u0633\u062A\u06D5`;
      }
      case "not_multiple_of":
        return `\u0698\u0645\u0627\u0631\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u062F\u06D5\u0628\u06CE\u062A \u0686\u06D5\u0646\u062F \u0647\u06CE\u0646\u062F\u06D5 \u0628\u06CE\u062A \u0628\u06C6 ${r.divisor}`;
      case "unrecognized_keys":
        return `\u06A9\u0644\u06CC\u0644\u06CC \u0646\u06D5\u0646\u0627\u0633\u0631\u0627\u0648: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u06A9\u0644\u06CC\u0644\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A \u0644\u06D5 ${r.origin}`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0
          ? `\u0628\u06D5\u0647\u0627\u06CC \u0646\u06D5\u0646\u0627\u0633\u0631\u0627\u0648 \u0647\u06D5\u06CC\u06D5. \u0628\u06D5\u0647\u0627\u06CC \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648: ${r.options.map((a) => `'${a}'`).join(" | ")}`
          : "\u06CC\u06D5\u06A9\u06AF\u0631\u062A\u0646\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A";
      case "invalid_element":
        return `${r.origin} \u0628\u06D5\u0647\u0627\u06A9\u06D5 \u0646\u0627\u062F\u0631\u0648\u0633\u062A\u06D5`;
      default:
        return "\u062A\u06CE\u06A9\u0631\u062F\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A";
    }
  };
};
function gp() {
  return { localeError: u_() };
}
var c_ = () => {
  let e = {
    string: { unit: "znak\u016F", verb: "m\xEDt" },
    file: { unit: "bajt\u016F", verb: "m\xEDt" },
    array: { unit: "prvk\u016F", verb: "m\xEDt" },
    set: { unit: "prvk\u016F", verb: "m\xEDt" },
    map: { unit: "prvk\u016F", verb: "m\xEDt" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "regul\xE1rn\xED v\xFDraz",
      email: "e-mailov\xE1 adresa",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "datum a \u010Das ve form\xE1tu ISO",
      date: "datum ve form\xE1tu ISO",
      time: "\u010Das ve form\xE1tu ISO",
      duration: "doba trv\xE1n\xED ISO",
      ipv4: "IPv4 adresa",
      ipv6: "IPv6 adresa",
      mac: "MAC adresa",
      cidrv4: "rozsah IPv4",
      cidrv6: "rozsah IPv6",
      base64: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64",
      base64url: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64url",
      json_string: "\u0159et\u011Bzec ve form\xE1tu JSON",
      e164: "\u010D\xEDslo E.164",
      credit_card: "\u010D\xEDslo kreditn\xED karty",
      currency_code: "k\xF3d m\u011Bny",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "vstup",
    },
    o = {
      nan: "NaN",
      number: "\u010D\xEDslo",
      string: "\u0159et\u011Bzec",
      function: "funkce",
      array: "pole",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof ${r.expected}, obdr\u017Eeno ${s}`
          : `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${i}, obdr\u017Eeno ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${y(r.values[0])}`
          : `Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${r.origin ?? "hodnota"} mus\xED m\xEDt ${i}${r.maximum.toString()} ${a.unit ?? "prvk\u016F"}`
          : `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${r.origin ?? "hodnota"} mus\xED b\xFDt ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${r.origin ?? "hodnota"} mus\xED m\xEDt ${i}${r.minimum.toString()} ${a.unit ?? "prvk\u016F"}`
          : `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${r.origin ?? "hodnota"} mus\xED b\xFDt ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED za\u010D\xEDnat na "${i.prefix}"`
          : i.format === "ends_with"
            ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED kon\u010Dit na "${i.suffix}"`
            : i.format === "includes"
              ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED obsahovat "${i.includes}"`
              : i.format === "regex"
                ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED odpov\xEDdat vzoru ${i.pattern}`
                : `Neplatn\xFD form\xE1t ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neplatn\xE9 \u010D\xEDslo: mus\xED b\xFDt n\xE1sobkem ${r.divisor}`;
      case "unrecognized_keys":
        return `Nezn\xE1m\xE9 kl\xED\u010De: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Neplatn\xFD kl\xED\u010D v ${r.origin}`;
      case "invalid_union":
        return "Neplatn\xFD vstup";
      case "invalid_element":
        return `Neplatn\xE1 hodnota v ${r.origin}`;
      default:
        return "Neplatn\xFD vstup";
    }
  };
};
function vp() {
  return { localeError: c_() };
}
var l_ = () => {
  let e = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" },
    map: { unit: "elementer", verb: "indeholdt" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "input",
      email: "e-mailadresse",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO dato- og klokkesl\xE6t",
      date: "ISO-dato",
      time: "ISO-klokkesl\xE6t",
      duration: "ISO-varighed",
      ipv4: "IPv4-adresse",
      ipv6: "IPv6-adresse",
      mac: "MAC-adresse",
      cidrv4: "IPv4-spektrum",
      cidrv6: "IPv6-spektrum",
      base64: "base64-kodet streng",
      base64url: "base64url-kodet streng",
      json_string: "JSON-streng",
      e164: "E.164-nummer",
      credit_card: "kreditkortnummer",
      currency_code: "valutakode",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = {
      nan: "NaN",
      string: "streng",
      number: "tal",
      boolean: "boolean",
      array: "liste",
      object: "objekt",
      set: "s\xE6t",
      file: "fil",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Ugyldigt input: forventede instanceof ${r.expected}, fik ${s}`
          : `Ugyldigt input: forventede ${i}, fik ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Ugyldig v\xE6rdi: forventede ${y(r.values[0])}`
          : `Ugyldigt valg: forventede en af f\xF8lgende ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin),
          s = o[r.origin] ?? r.origin;
        return a
          ? `For stor: forventede ${s ?? "value"} ${a.verb} ${i} ${r.maximum.toString()} ${a.unit ?? "elementer"}`
          : `For stor: forventede ${s ?? "value"} havde ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin),
          s = o[r.origin] ?? r.origin;
        return a
          ? `For lille: forventede ${s} ${a.verb} ${i} ${r.minimum.toString()} ${a.unit}`
          : `For lille: forventede ${s} havde ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Ugyldig streng: skal starte med "${i.prefix}"`
          : i.format === "ends_with"
            ? `Ugyldig streng: skal ende med "${i.suffix}"`
            : i.format === "includes"
              ? `Ugyldig streng: skal indeholde "${i.includes}"`
              : i.format === "regex"
                ? `Ugyldig streng: skal matche m\xF8nsteret ${i.pattern}`
                : `Ugyldig ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal v\xE6re deleligt med ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukendte n\xF8gler" : "Ukendt n\xF8gle"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig n\xF8gle i ${r.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig v\xE6rdi i ${r.origin}`;
      default:
        return "Ugyldigt input";
    }
  };
};
function hp() {
  return { localeError: l_() };
}
var d_ = () => {
  let e = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" },
    map: { unit: "Elemente", verb: "zu haben" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "Eingabe",
      email: "E-Mail-Adresse",
      url: "URL",
      emoji: "Emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-Datum und -Uhrzeit",
      date: "ISO-Datum",
      time: "ISO-Uhrzeit",
      duration: "ISO-Dauer",
      ipv4: "IPv4-Adresse",
      ipv6: "IPv6-Adresse",
      mac: "MAC-Adresse",
      cidrv4: "IPv4-Bereich",
      cidrv6: "IPv6-Bereich",
      base64: "Base64-codierter String",
      base64url: "Base64-URL-codierter String",
      json_string: "JSON-String",
      e164: "E.164-Nummer",
      credit_card: "Kreditkartennummer",
      currency_code: "W\xE4hrungscode",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "Eingabe",
    },
    o = { nan: "NaN", number: "Zahl", array: "Array" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Ung\xFCltige Eingabe: erwartet instanceof ${r.expected}, erhalten ${s}`
          : `Ung\xFCltige Eingabe: erwartet ${i}, erhalten ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Ung\xFCltige Eingabe: erwartet ${y(r.values[0])}`
          : `Ung\xFCltige Option: erwartet eine von ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Zu gro\xDF: erwartet, dass ${r.origin ?? "Wert"} ${i}${r.maximum.toString()} ${a.unit ?? "Elemente"} hat`
          : `Zu gro\xDF: erwartet, dass ${r.origin ?? "Wert"} ${i}${r.maximum.toString()} ist`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Zu klein: erwartet, dass ${r.origin} ${i}${r.minimum.toString()} ${a.unit} hat`
          : `Zu klein: erwartet, dass ${r.origin} ${i}${r.minimum.toString()} ist`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Ung\xFCltiger String: muss mit "${i.prefix}" beginnen`
          : i.format === "ends_with"
            ? `Ung\xFCltiger String: muss mit "${i.suffix}" enden`
            : i.format === "includes"
              ? `Ung\xFCltiger String: muss "${i.includes}" enthalten`
              : i.format === "regex"
                ? `Ung\xFCltiger String: muss dem Muster ${i.pattern} entsprechen`
                : `Ung\xFCltig: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ung\xFCltige Zahl: muss ein Vielfaches von ${r.divisor} sein`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Unbekannte Schl\xFCssel" : "Unbekannter Schl\xFCssel"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Ung\xFCltiger Schl\xFCssel in ${r.origin}`;
      case "invalid_union":
        return "Ung\xFCltige Eingabe";
      case "invalid_element":
        return `Ung\xFCltiger Wert in ${r.origin}`;
      default:
        return "Ung\xFCltige Eingabe";
    }
  };
};
function yp() {
  return { localeError: d_() };
}
var f_ = () => {
  let e = {
    string: {
      unit: "\u03C7\u03B1\u03C1\u03B1\u03BA\u03C4\u03AE\u03C1\u03B5\u03C2",
      verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
    },
    file: { unit: "bytes", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" },
    array: {
      unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
      verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
    },
    set: {
      unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
      verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
    },
    map: {
      unit: "\u03BA\u03B1\u03C4\u03B1\u03C7\u03C9\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2",
      verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
      email: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03BA\u03B1\u03B9 \u03CE\u03C1\u03B1",
      date: "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1",
      time: "ISO \u03CE\u03C1\u03B1",
      duration: "ISO \u03B4\u03B9\u03AC\u03C1\u03BA\u03B5\u03B9\u03B1",
      ipv4: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv4",
      ipv6: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv6",
      mac: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 MAC",
      cidrv4: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv4",
      cidrv6: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv6",
      base64:
        "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64",
      base64url:
        "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64url",
      json_string:
        "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC JSON",
      e164: "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 E.164",
      credit_card:
        "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 \u03C0\u03B9\u03C3\u03C4\u03C9\u03C4\u03B9\u03BA\u03AE\u03C2 \u03BA\u03AC\u03C1\u03C4\u03B1\u03C2",
      currency_code:
        "\u03BA\u03C9\u03B4\u03B9\u03BA\u03CC\u03C2 \u03BD\u03BF\u03BC\u03AF\u03C3\u03BC\u03B1\u03C4\u03BF\u03C2",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return typeof r.expected == "string" && /^[A-Z]/.test(r.expected)
          ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD instanceof ${r.expected}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${s}`
          : `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${i}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${y(r.values[0])}`
          : `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD \u03AD\u03BD\u03B1 \u03B1\u03C0\u03CC ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${r.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${i}${r.maximum.toString()} ${a.unit ?? "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1"}`
          : `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${r.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${r.origin} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${i}${r.minimum.toString()} ${a.unit}`
          : `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${r.origin} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AC \u03BC\u03B5 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B5\u03BB\u03B5\u03B9\u03CE\u03BD\u03B5\u03B9 \u03BC\u03B5 "${i.suffix}"`
            : i.format === "includes"
              ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C0\u03B5\u03C1\u03B9\u03AD\u03C7\u03B5\u03B9 "${i.includes}"`
              : i.format === "regex"
                ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B1\u03B9\u03C1\u03B9\u03AC\u03B6\u03B5\u03B9 \u03BC\u03B5 \u03C4\u03BF \u03BC\u03BF\u03C4\u03AF\u03B2\u03BF ${i.pattern}`
                : `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF\u03C2 \u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C0\u03BF\u03BB\u03BB\u03B1\u03C0\u03BB\u03AC\u03C3\u03B9\u03BF \u03C4\u03BF\u03C5 ${r.divisor}`;
      case "unrecognized_keys":
        return `\u0386\u03B3\u03BD\u03C9\u03C3\u03C4${r.keys.length > 1 ? "\u03B1" : "\u03BF"} \u03BA\u03BB\u03B5\u03B9\u03B4${r.keys.length > 1 ? "\u03B9\u03AC" : "\u03AF"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF \u03BA\u03BB\u03B5\u03B9\u03B4\u03AF \u03C3\u03C4\u03BF ${r.origin}`;
      case "invalid_union":
        return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
      case "invalid_element":
        return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C4\u03B9\u03BC\u03AE \u03C3\u03C4\u03BF ${r.origin}`;
      default:
        return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
    }
  };
};
function $p() {
  return { localeError: f_() };
}
var m_ = () => {
  let e = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" },
  };
  function t(i) {
    return e[i] ?? null;
  }
  let n = {
      regex: "input",
      email: "email address",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datetime",
      date: "ISO date",
      time: "ISO time",
      duration: "ISO duration",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      mac: "MAC address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded string",
      base64url: "base64url-encoded string",
      json_string: "JSON string",
      e164: "E.164 number",
      currency_code: "currency code",
      credit_card: "credit card number",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = { nan: "NaN" };
  function r(i, a) {
    return i === "number" && typeof a == "number" && !Number.isFinite(a)
      ? String(a)
      : (o[i] ?? i);
  }
  return (i) => {
    switch (i.code) {
      case "invalid_type": {
        let a = r(i.expected),
          s = $(i.input),
          c = r(s, i.input);
        return `Invalid input: expected ${a}, received ${c}`;
      }
      case "invalid_value":
        return i.values.length === 1
          ? `Invalid input: expected ${y(i.values[0])}`
          : `Invalid option: expected one of ${g(i.values, "|")}`;
      case "too_big": {
        let a = i.exact ? "exactly " : i.inclusive ? "<=" : "<",
          s = t(i.origin);
        return s
          ? `Too big: expected ${i.origin ?? "value"} to have ${a}${i.maximum.toString()} ${s.unit ?? "elements"}`
          : `Too big: expected ${i.origin ?? "value"} to be ${a}${i.maximum.toString()}`;
      }
      case "too_small": {
        let a = i.exact ? "exactly " : i.inclusive ? ">=" : ">",
          s = t(i.origin);
        return s
          ? `Too small: expected ${i.origin} to have ${a}${i.minimum.toString()} ${s.unit}`
          : `Too small: expected ${i.origin} to be ${a}${i.minimum.toString()}`;
      }
      case "invalid_format": {
        let a = i;
        return a.format === "starts_with"
          ? `Invalid string: must start with "${a.prefix}"`
          : a.format === "ends_with"
            ? `Invalid string: must end with "${a.suffix}"`
            : a.format === "includes"
              ? `Invalid string: must include "${a.includes}"`
              : a.format === "regex"
                ? `Invalid string: must match pattern ${a.pattern}`
                : `Invalid ${n[a.format] ?? i.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${i.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${i.keys.length > 1 ? "s" : ""}: ${g(i.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${i.origin}`;
      case "invalid_union":
        return i.options && Array.isArray(i.options) && i.options.length > 0
          ? `Invalid discriminator value. Expected ${i.options.map((s) => `'${s}'`).join(" | ")}`
          : i.inclusive === !1
            ? "Invalid input: more than one option matched"
            : "Invalid input";
      case "invalid_element":
        return `Invalid value in ${i.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function no() {
  return { localeError: m_() };
}
var p_ = () => {
  let e = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" },
    map: { unit: "elementojn", verb: "havi" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "enigo",
      email: "retadreso",
      url: "URL",
      emoji: "emo\u011Dio",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-datotempo",
      date: "ISO-dato",
      time: "ISO-tempo",
      duration: "ISO-da\u016Dro",
      ipv4: "IPv4-adreso",
      ipv6: "IPv6-adreso",
      mac: "MAC-adreso",
      cidrv4: "IPv4-rango",
      cidrv6: "IPv6-rango",
      base64: "64-ume kodita karaktraro",
      base64url: "URL-64-ume kodita karaktraro",
      json_string: "JSON-karaktraro",
      e164: "E.164-nombro",
      credit_card: "kreditkarta numero",
      currency_code: "valuta kodo",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "enigo",
    },
    o = { nan: "NaN", number: "nombro", array: "tabelo", null: "senvalora" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Nevalida enigo: atendi\u011Dis instanceof ${r.expected}, ricevi\u011Dis ${s}`
          : `Nevalida enigo: atendi\u011Dis ${i}, ricevi\u011Dis ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Nevalida enigo: atendi\u011Dis ${y(r.values[0])}`
          : `Nevalida opcio: atendi\u011Dis unu el ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Tro granda: atendi\u011Dis ke ${r.origin ?? "valoro"} havu ${i}${r.maximum.toString()} ${a.unit ?? "elementojn"}`
          : `Tro granda: atendi\u011Dis ke ${r.origin ?? "valoro"} havu ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Tro malgranda: atendi\u011Dis ke ${r.origin} havu ${i}${r.minimum.toString()} ${a.unit}`
          : `Tro malgranda: atendi\u011Dis ke ${r.origin} estu ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Nevalida karaktraro: devas komenci\u011Di per "${i.prefix}"`
          : i.format === "ends_with"
            ? `Nevalida karaktraro: devas fini\u011Di per "${i.suffix}"`
            : i.format === "includes"
              ? `Nevalida karaktraro: devas inkluzivi "${i.includes}"`
              : i.format === "regex"
                ? `Nevalida karaktraro: devas kongrui kun la modelo ${i.pattern}`
                : `Nevalida ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${r.keys.length > 1 ? "j" : ""} \u015Dlosilo${r.keys.length > 1 ? "j" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida \u015Dlosilo en ${r.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${r.origin}`;
      default:
        return "Nevalida enigo";
    }
  };
};
function _p() {
  return { localeError: p_() };
}
var g_ = () => {
  let e = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "entrada",
      email: "direcci\xF3n de correo electr\xF3nico",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "fecha y hora ISO",
      date: "fecha ISO",
      time: "hora ISO",
      duration: "duraci\xF3n ISO",
      ipv4: "direcci\xF3n IPv4",
      ipv6: "direcci\xF3n IPv6",
      mac: "direcci\xF3n MAC",
      cidrv4: "rango IPv4",
      cidrv6: "rango IPv6",
      base64: "cadena codificada en base64",
      base64url: "URL codificada en base64",
      json_string: "cadena JSON",
      e164: "n\xFAmero E.164",
      credit_card: "n\xFAmero de tarjeta de cr\xE9dito",
      currency_code: "c\xF3digo de moneda",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "entrada",
    },
    o = {
      nan: "NaN",
      string: "texto",
      number: "n\xFAmero",
      boolean: "booleano",
      array: "arreglo",
      object: "objeto",
      set: "conjunto",
      file: "archivo",
      date: "fecha",
      bigint: "n\xFAmero grande",
      symbol: "s\xEDmbolo",
      undefined: "indefinido",
      null: "nulo",
      function: "funci\xF3n",
      map: "mapa",
      record: "registro",
      tuple: "tupla",
      enum: "enumeraci\xF3n",
      union: "uni\xF3n",
      literal: "literal",
      promise: "promesa",
      void: "vac\xEDo",
      never: "nunca",
      unknown: "desconocido",
      any: "cualquiera",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Entrada inv\xE1lida: se esperaba instanceof ${r.expected}, recibido ${s}`
          : `Entrada inv\xE1lida: se esperaba ${i}, recibido ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Entrada inv\xE1lida: se esperaba ${y(r.values[0])}`
          : `Opci\xF3n inv\xE1lida: se esperaba una de ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin),
          s = o[r.origin] ?? r.origin;
        return a
          ? `Demasiado grande: se esperaba que ${s ?? "valor"} tuviera ${i}${r.maximum.toString()} ${a.unit ?? "elementos"}`
          : `Demasiado grande: se esperaba que ${s ?? "valor"} fuera ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin),
          s = o[r.origin] ?? r.origin;
        return a
          ? `Demasiado peque\xF1o: se esperaba que ${s} tuviera ${i}${r.minimum.toString()} ${a.unit}`
          : `Demasiado peque\xF1o: se esperaba que ${s} fuera ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Cadena inv\xE1lida: debe comenzar con "${i.prefix}"`
          : i.format === "ends_with"
            ? `Cadena inv\xE1lida: debe terminar en "${i.suffix}"`
            : i.format === "includes"
              ? `Cadena inv\xE1lida: debe incluir "${i.includes}"`
              : i.format === "regex"
                ? `Cadena inv\xE1lida: debe coincidir con el patr\xF3n ${i.pattern}`
                : `Inv\xE1lido ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `N\xFAmero inv\xE1lido: debe ser m\xFAltiplo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Llave${r.keys.length > 1 ? "s" : ""} desconocida${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Llave inv\xE1lida en ${o[r.origin] ?? r.origin}`;
      case "invalid_union":
        return "Entrada inv\xE1lida";
      case "invalid_element":
        return `Valor inv\xE1lido en ${o[r.origin] ?? r.origin}`;
      default:
        return "Entrada inv\xE1lida";
    }
  };
};
function bp() {
  return { localeError: g_() };
}
var v_ = () => {
  let e = {
    string: {
      unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631",
      verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
    },
    file: {
      unit: "\u0628\u0627\u06CC\u062A",
      verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
    },
    array: {
      unit: "\u0622\u06CC\u062A\u0645",
      verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
    },
    set: {
      unit: "\u0622\u06CC\u062A\u0645",
      verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
    },
    map: {
      unit: "\u0622\u06CC\u062A\u0645",
      verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0648\u0631\u0648\u062F\u06CC",
      email: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
      url: "URL",
      emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u062A\u0627\u0631\u06CC\u062E \u0648 \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
      date: "\u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0632\u0648",
      time: "\u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
      duration:
        "\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
      ipv4: "IPv4 \u0622\u062F\u0631\u0633",
      ipv6: "IPv6 \u0622\u062F\u0631\u0633",
      mac: "MAC \u0622\u062F\u0631\u0633",
      cidrv4: "IPv4 \u062F\u0627\u0645\u0646\u0647",
      cidrv6: "IPv6 \u062F\u0627\u0645\u0646\u0647",
      base64: "base64-encoded \u0631\u0634\u062A\u0647",
      base64url: "base64url-encoded \u0631\u0634\u062A\u0647",
      json_string: "JSON \u0631\u0634\u062A\u0647",
      e164: "E.164 \u0639\u062F\u062F",
      credit_card:
        "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A \u0627\u0639\u062A\u0628\u0627\u0631\u06CC",
      currency_code: "\u06A9\u062F \u0627\u0631\u0632",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0648\u0631\u0648\u062F\u06CC",
    },
    o = {
      nan: "NaN",
      number: "\u0639\u062F\u062F",
      array: "\u0622\u0631\u0627\u06CC\u0647",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof ${r.expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${s} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`
          : `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${i} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${s} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${y(r.values[0])} \u0645\u06CC\u200C\u0628\u0648\u062F`
          : `\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ${g(r.values, "|")} \u0645\u06CC\u200C\u0628\u0648\u062F`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${r.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0635\u0631"} \u0628\u0627\u0634\u062F`
          : `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${r.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} \u0628\u0627\u0634\u062F`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} ${a.unit} \u0628\u0627\u0634\u062F`
          : `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} \u0628\u0627\u0634\u062F`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${i.prefix}" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F`
          : i.format === "ends_with"
            ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${i.suffix}" \u062A\u0645\u0627\u0645 \u0634\u0648\u062F`
            : i.format === "includes"
              ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 "${i.includes}" \u0628\u0627\u0634\u062F`
              : i.format === "regex"
                ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC ${i.pattern} \u0645\u0637\u0627\u0628\u0642\u062A \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F`
                : `${n[i.format] ?? r.format} \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
      }
      case "not_multiple_of":
        return `\u0639\u062F\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0645\u0636\u0631\u0628 ${r.divisor} \u0628\u0627\u0634\u062F`;
      case "unrecognized_keys":
        return `\u06A9\u0644\u06CC\u062F${r.keys.length > 1 ? "\u0647\u0627\u06CC" : ""} \u0646\u0627\u0634\u0646\u0627\u0633: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u06A9\u0644\u06CC\u062F \u0646\u0627\u0634\u0646\u0627\u0633 \u062F\u0631 ${r.origin}`;
      case "invalid_union":
        return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
      case "invalid_element":
        return `\u0645\u0642\u062F\u0627\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u062F\u0631 ${r.origin}`;
      default:
        return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
    }
  };
};
function xp() {
  return { localeError: v_() };
}
var h_ = () => {
  let e = {
    string: { unit: "merkki\xE4", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    map: { unit: "alkiota", subject: "kuvauksen" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "p\xE4iv\xE4m\xE4\xE4r\xE4n" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "s\xE4\xE4nn\xF6llinen lauseke",
      email: "s\xE4hk\xF6postiosoite",
      url: "URL-osoite",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-aikaleima",
      date: "ISO-p\xE4iv\xE4m\xE4\xE4r\xE4",
      time: "ISO-aika",
      duration: "ISO-kesto",
      ipv4: "IPv4-osoite",
      ipv6: "IPv6-osoite",
      mac: "MAC-osoite",
      cidrv4: "IPv4-alue",
      cidrv6: "IPv6-alue",
      base64: "base64-koodattu merkkijono",
      base64url: "base64url-koodattu merkkijono",
      json_string: "JSON-merkkijono",
      e164: "E.164-luku",
      credit_card: "luottokortin numero",
      currency_code: "valuuttakoodi",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "templaattimerkkijono",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Virheellinen tyyppi: odotettiin instanceof ${r.expected}, oli ${s}`
          : `Virheellinen tyyppi: odotettiin ${i}, oli ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Virheellinen sy\xF6te: t\xE4ytyy olla ${y(r.values[0])}`
          : `Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Liian suuri: ${a.subject} t\xE4ytyy olla ${i}${r.maximum.toString()} ${a.unit}`.trim()
          : `Liian suuri: arvon t\xE4ytyy olla ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Liian pieni: ${a.subject} t\xE4ytyy olla ${i}${r.minimum.toString()} ${a.unit}`.trim()
          : `Liian pieni: arvon t\xE4ytyy olla ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Virheellinen sy\xF6te: t\xE4ytyy alkaa "${i.prefix}"`
          : i.format === "ends_with"
            ? `Virheellinen sy\xF6te: t\xE4ytyy loppua "${i.suffix}"`
            : i.format === "includes"
              ? `Virheellinen sy\xF6te: t\xE4ytyy sis\xE4lt\xE4\xE4 "${i.includes}"`
              : i.format === "regex"
                ? `Virheellinen sy\xF6te: t\xE4ytyy vastata s\xE4\xE4nn\xF6llist\xE4 lauseketta ${i.pattern}`
                : `Virheellinen ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: t\xE4ytyy olla luvun ${r.divisor} monikerta`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return "Virheellinen sy\xF6te";
    }
  };
};
function kp() {
  return { localeError: h_() };
}
var y_ = () => {
  let e = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "expression r\xE9guli\xE8re",
      email: "adresse e-mail",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "date et heure ISO",
      date: "date ISO",
      time: "heure ISO",
      duration: "dur\xE9e ISO",
      ipv4: "adresse IPv4",
      ipv6: "adresse IPv6",
      mac: "adresse MAC",
      cidrv4: "plage IPv4",
      cidrv6: "plage IPv6",
      base64: "cha\xEEne de caract\xE8res encod\xE9e en base64",
      base64url: "cha\xEEne de caract\xE8res encod\xE9e en base64url",
      json_string: "cha\xEEne de caract\xE8res JSON",
      e164: "num\xE9ro au format E.164",
      credit_card: "num\xE9ro de carte de cr\xE9dit",
      currency_code: "code de devise",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "entr\xE9e",
    },
    o = {
      string: "cha\xEEne de caract\xE8res",
      number: "nombre",
      int: "entier",
      boolean: "bool\xE9en",
      bigint: "grand entier",
      symbol: "symbole",
      undefined: "ind\xE9fini",
      null: "null",
      never: "jamais",
      void: "vide",
      date: "date",
      array: "tableau",
      object: "objet",
      tuple: "tuple",
      record: "record",
      map: "map",
      set: "ensemble",
      file: "fichier",
      nonoptional: "non optionnel",
      nan: "NaN",
      function: "fonction",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Entr\xE9e invalide : instance de ${r.expected} attendu, ${s} re\xE7u`
          : `Entr\xE9e invalide : ${i} attendu, ${s} re\xE7u`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Entr\xE9e invalide : ${y(r.values[0])} attendu`
          : `Option invalide : une valeur parmi ${g(r.values, "|")} attendue`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Trop grand : ${o[r.origin] ?? "valeur"} doit ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "\xE9l\xE9ment(s)"}`
          : `Trop grand : ${o[r.origin] ?? "valeur"} doit \xEAtre ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Trop petit : ${o[r.origin] ?? "valeur"} doit ${a.verb} ${i}${r.minimum.toString()} ${a.unit}`
          : `Trop petit : ${o[r.origin] ?? "valeur"} doit \xEAtre ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Cha\xEEne de caract\xE8res invalide : doit commencer par "${i.prefix}"`
          : i.format === "ends_with"
            ? `Cha\xEEne de caract\xE8res invalide : doit se terminer par "${i.suffix}"`
            : i.format === "includes"
              ? `Cha\xEEne de caract\xE8res invalide : doit inclure "${i.includes}"`
              : i.format === "regex"
                ? `Cha\xEEne de caract\xE8res invalide : doit correspondre au motif ${i.pattern}`
                : `${n[i.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit \xEAtre un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Cl\xE9${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Cl\xE9 invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entr\xE9e invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entr\xE9e invalide";
    }
  };
};
function wp() {
  return { localeError: y_() };
}
var $_ = () => {
  let e = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" },
    map: { unit: "\xE9l\xE9ments", verb: "avoir" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "entr\xE9e",
      email: "adresse courriel",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "date-heure ISO",
      date: "date ISO",
      time: "heure ISO",
      duration: "dur\xE9e ISO",
      ipv4: "adresse IPv4",
      ipv6: "adresse IPv6",
      mac: "adresse MAC",
      cidrv4: "plage IPv4",
      cidrv6: "plage IPv6",
      base64: "cha\xEEne encod\xE9e en base64",
      base64url: "cha\xEEne encod\xE9e en base64url",
      json_string: "cha\xEEne JSON",
      e164: "num\xE9ro E.164",
      credit_card: "num\xE9ro de carte de cr\xE9dit",
      currency_code: "code de devise",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "entr\xE9e",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Entr\xE9e invalide : attendu instanceof ${r.expected}, re\xE7u ${s}`
          : `Entr\xE9e invalide : attendu ${i}, re\xE7u ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Entr\xE9e invalide : attendu ${y(r.values[0])}`
          : `Option invalide : attendu l'une des valeurs suivantes ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "\u2264" : "<",
          a = t(r.origin);
        return a
          ? `Trop grand : attendu que ${r.origin ?? "la valeur"} ait ${i}${r.maximum.toString()} ${a.unit}`
          : `Trop grand : attendu que ${r.origin ?? "la valeur"} soit ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? "\u2265" : ">",
          a = t(r.origin);
        return a
          ? `Trop petit : attendu que ${r.origin} ait ${i}${r.minimum.toString()} ${a.unit}`
          : `Trop petit : attendu que ${r.origin} soit ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Cha\xEEne invalide : doit commencer par "${i.prefix}"`
          : i.format === "ends_with"
            ? `Cha\xEEne invalide : doit se terminer par "${i.suffix}"`
            : i.format === "includes"
              ? `Cha\xEEne invalide : doit inclure "${i.includes}"`
              : i.format === "regex"
                ? `Cha\xEEne invalide : doit correspondre au motif ${i.pattern}`
                : `${n[i.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit \xEAtre un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Cl\xE9${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Cl\xE9 invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entr\xE9e invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entr\xE9e invalide";
    }
  };
};
function Ip() {
  return { localeError: $_() };
}
var __ = () => {
  let e = {
    string: {
      unit: "\u0A85\u0A95\u0ACD\u0AB7\u0AB0",
      verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
    },
    file: {
      unit: "\u0AAC\u0ABE\u0AAF\u0A9F",
      verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
    },
    array: {
      unit: "\u0A86\u0A87\u0A9F\u0AAE",
      verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
    },
    set: {
      unit: "\u0A86\u0A87\u0A9F\u0AAE",
      verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
    },
    map: {
      unit: "\u0A8F\u0AA8\u0ACD\u0A9F\u0ACD\u0AB0\u0AC0",
      verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F",
      email:
        "\u0A88\u0AAE\u0AC7\u0A87\u0AB2 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
      url: "URL",
      emoji: "\u0A87\u0AAE\u0ACB\u0A9C\u0AC0",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96 \u0A85\u0AA8\u0AC7 \u0AB8\u0AAE\u0AAF",
      date: "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96",
      time: "ISO \u0AB8\u0AAE\u0AAF",
      duration: "ISO \u0A85\u0AB5\u0AA7\u0ABF",
      ipv4: "IPv4 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
      ipv6: "IPv6 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
      mac: "MAC \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
      cidrv4: "IPv4 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
      cidrv6: "IPv6 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
      base64:
        "base64-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
      base64url:
        "base64url-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
      json_string: "JSON \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
      e164: "E.164 \u0AA8\u0A82\u0AAC\u0AB0",
      credit_card:
        "\u0A95\u0ACD\u0AB0\u0AC7\u0AA1\u0ABF\u0A9F \u0A95\u0ABE\u0AB0\u0ACD\u0AA1 \u0AA8\u0A82\u0AAC\u0AB0",
      currency_code: "\u0A9A\u0AB2\u0AA3 \u0A95\u0ACB\u0AA1",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ${i}, \u0AAA\u0ACD\u0AB0\u0ABE\u0AAA\u0ACD\u0AA4 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ${y(r.values[0])}`
          : `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB5\u0ABF\u0A95\u0AB2\u0ACD\u0AAA: ${g(r.values, " | ")} \u0AAE\u0ABE\u0AA7\u0ACD\u0AAF\u0AAE\u0AA5\u0AC0 \u0A8F\u0A95 \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: ${r.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF"} ${i}${r.maximum.toString()} ${a.unit ?? "\u0A8F\u0AB2\u0ABF\u0AAE\u0AC7\u0AA8\u0ACD\u0A9F"} \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F`
          : `\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: ${r.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF"} ${i}${r.maximum.toString()} \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: ${r.origin} ${i}${r.minimum.toString()} ${a.unit} \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F`
          : `\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: ${r.origin} ${i}${r.minimum.toString()} \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "${i.prefix}" \u0AA5\u0AC0 \u0AB6\u0AB0\u0AC2 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
          : i.format === "ends_with"
            ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "${i.suffix}" \u0AAA\u0AB0 \u0AB8\u0AAE\u0ABE\u0AAA\u0ACD\u0AA4 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
            : i.format === "includes"
              ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "${i.includes}" \u0AB6\u0ABE\u0AAE\u0AC7\u0AB2 \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
              : i.format === "regex"
                ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: \u0AAA\u0AC7\u0A9F\u0AB0\u0ACD\u0AA8 ${i.pattern} \u0AB8\u0ABE\u0AA5\u0AC7 \u0AAE\u0AC7\u0AB3 \u0A96\u0ABE\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
                : `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA8\u0A82\u0AAC\u0AB0: ${r.divisor} \u0AA8\u0ACB \u0A97\u0AC1\u0AA3\u0ABE\u0A82\u0A95 \u0AB9\u0ACB\u0AB5\u0ACB \u0A9C\u0ACB\u0A88\u0A8F`;
      case "unrecognized_keys":
        return `\u0A93\u0AB3\u0A96\u0AC0 \u0AB6\u0A95\u0ABE\u0AA4\u0ABE \u0AA8\u0AB9\u0AC0\u0A82 \u0AA4\u0AC7 \u0A95\u0AC0${r.keys.length > 1 ? "\u0A93" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A95\u0AC0`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0
          ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA1\u0ABF\u0AB8\u0ACD\u0A95\u0ACD\u0AB0\u0ABF\u0AAE\u0ABF\u0AA8\u0AC7\u0A9F\u0AB0 \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF. \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ${r.options.map((a) => `'${a}'`).join(" | ")}`
          : "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
      case "invalid_element":
        return `${r.origin} \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF`;
      default:
        return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
    }
  };
};
function Sp() {
  return { localeError: __() };
}
var b_ = () => {
  let e = {
      string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA", gender: "f" },
      number: { label: "\u05DE\u05E1\u05E4\u05E8", gender: "m" },
      boolean: {
        label: "\u05E2\u05E8\u05DA \u05D1\u05D5\u05DC\u05D9\u05D0\u05E0\u05D9",
        gender: "m",
      },
      bigint: { label: "BigInt", gender: "m" },
      date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA", gender: "m" },
      array: { label: "\u05DE\u05E2\u05E8\u05DA", gender: "m" },
      object: {
        label: "\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8",
        gender: "m",
      },
      null: {
        label: "\u05E2\u05E8\u05DA \u05E8\u05D9\u05E7 (null)",
        gender: "m",
      },
      undefined: {
        label:
          "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 (undefined)",
        gender: "m",
      },
      symbol: {
        label: "\u05E1\u05D9\u05DE\u05D1\u05D5\u05DC (Symbol)",
        gender: "m",
      },
      function: {
        label: "\u05E4\u05D5\u05E0\u05E7\u05E6\u05D9\u05D4",
        gender: "f",
      },
      map: { label: "\u05DE\u05E4\u05D4 (Map)", gender: "f" },
      set: { label: "\u05E7\u05D1\u05D5\u05E6\u05D4 (Set)", gender: "f" },
      file: { label: "\u05E7\u05D5\u05D1\u05E5", gender: "m" },
      promise: { label: "Promise", gender: "m" },
      NaN: { label: "NaN", gender: "m" },
      unknown: {
        label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2",
        gender: "m",
      },
      value: { label: "\u05E2\u05E8\u05DA", gender: "m" },
    },
    t = {
      string: {
        unit: "\u05EA\u05D5\u05D5\u05D9\u05DD",
        shortLabel: "\u05E7\u05E6\u05E8",
        longLabel: "\u05D0\u05E8\u05D5\u05DA",
      },
      file: {
        unit: "\u05D1\u05D9\u05D9\u05D8\u05D9\u05DD",
        shortLabel: "\u05E7\u05D8\u05DF",
        longLabel: "\u05D2\u05D3\u05D5\u05DC",
      },
      array: {
        unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
        shortLabel: "\u05E7\u05D8\u05DF",
        longLabel: "\u05D2\u05D3\u05D5\u05DC",
      },
      set: {
        unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
        shortLabel: "\u05E7\u05D8\u05DF",
        longLabel: "\u05D2\u05D3\u05D5\u05DC",
      },
      number: {
        unit: "",
        shortLabel: "\u05E7\u05D8\u05DF",
        longLabel: "\u05D2\u05D3\u05D5\u05DC",
      },
    },
    n = (u) => (u ? e[u] : void 0),
    o = (u) => {
      let l = n(u);
      return l ? l.label : (u ?? e.unknown.label);
    },
    r = (u) => `\u05D4${o(u)}`,
    i = (u) =>
      (n(u)?.gender ?? "m") === "f"
        ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA"
        : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA",
    a = (u) => (u ? (t[u] ?? null) : null),
    s = {
      regex: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      email: {
        label:
          "\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC",
        gender: "f",
      },
      url: {
        label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05E8\u05E9\u05EA",
        gender: "f",
      },
      emoji: { label: "\u05D0\u05D9\u05DE\u05D5\u05D2'\u05D9", gender: "m" },
      uuid: { label: "UUID", gender: "m" },
      uuidv4: { label: "UUIDv4", gender: "m" },
      uuidv6: { label: "UUIDv6", gender: "m" },
      nanoid: { label: "nanoid", gender: "m" },
      guid: { label: "GUID", gender: "m" },
      cuid: { label: "cuid", gender: "m" },
      cuid2: { label: "cuid2", gender: "m" },
      ulid: { label: "ULID", gender: "m" },
      xid: { label: "XID", gender: "m" },
      ksuid: { label: "KSUID", gender: "m" },
      datetime: {
        label: "\u05EA\u05D0\u05E8\u05D9\u05DA \u05D5\u05D6\u05DE\u05DF ISO",
        gender: "m",
      },
      date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA ISO", gender: "m" },
      time: { label: "\u05D6\u05DE\u05DF ISO", gender: "m" },
      duration: {
        label: "\u05DE\u05E9\u05DA \u05D6\u05DE\u05DF ISO",
        gender: "m",
      },
      ipv4: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv4", gender: "f" },
      ipv6: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv6", gender: "f" },
      mac: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA MAC", gender: "f" },
      cidrv4: { label: "\u05D8\u05D5\u05D5\u05D7 IPv4", gender: "m" },
      cidrv6: { label: "\u05D8\u05D5\u05D5\u05D7 IPv6", gender: "m" },
      base64: {
        label:
          "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64",
        gender: "f",
      },
      base64url: {
        label:
          "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64 \u05DC\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05E8\u05E9\u05EA",
        gender: "f",
      },
      json_string: {
        label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA JSON",
        gender: "f",
      },
      e164: { label: "\u05DE\u05E1\u05E4\u05E8 E.164", gender: "m" },
      credit_card: {
        label:
          "\u05DE\u05E1\u05E4\u05E8 \u05DB\u05E8\u05D8\u05D9\u05E1 \u05D0\u05E9\u05E8\u05D0\u05D9",
        gender: "m",
      },
      currency_code: {
        label: "\u05E7\u05D5\u05D3 \u05DE\u05D8\u05D1\u05E2",
        gender: "m",
      },
      iban: { label: "IBAN", gender: "m" },
      jwt: { label: "JWT", gender: "m" },
      template_literal: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      ends_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      includes: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      lowercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      starts_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      uppercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
    },
    c = { nan: "NaN" };
  return (u) => {
    switch (u.code) {
      case "invalid_type": {
        let l = u.expected,
          d = c[l ?? ""] ?? o(l),
          f = $(u.input),
          m = c[f] ?? e[f]?.label ?? f;
        return /^[A-Z]/.test(u.expected)
          ? `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof ${u.expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${m}`
          : `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${d}, \u05D4\u05EA\u05E7\u05D1\u05DC ${m}`;
      }
      case "invalid_value": {
        if (u.values.length === 1)
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ${y(u.values[0])}`;
        let l = u.values.map((m) => y(m));
        if (u.values.length === 2)
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${l[0]} \u05D0\u05D5 ${l[1]}`;
        let d = l[l.length - 1];
        return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${l.slice(0, -1).join(", ")} \u05D0\u05D5 ${d}`;
      }
      case "too_big": {
        let l = a(u.origin),
          d = r(u.origin ?? "value");
        if (u.origin === "string")
          return `${l?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA"} \u05DE\u05D3\u05D9: ${d} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${u.maximum.toString()} ${l?.unit ?? ""} ${u.inclusive ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA" : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8"}`.trim();
        if (u.origin === "number") {
          let v = u.inclusive
            ? `\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${u.maximum}`
            : `\u05E7\u05D8\u05DF \u05DE-${u.maximum}`;
          return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${d} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${v}`;
        }
        if (u.origin === "array" || u.origin === "set") {
          let v =
              u.origin === "set"
                ? "\u05E6\u05E8\u05D9\u05DB\u05D4"
                : "\u05E6\u05E8\u05D9\u05DA",
            _ = u.inclusive
              ? `${u.maximum} ${l?.unit ?? ""} \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA`
              : `\u05E4\u05D7\u05D5\u05EA \u05DE-${u.maximum} ${l?.unit ?? ""}`;
          return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${d} ${v} \u05DC\u05D4\u05DB\u05D9\u05DC ${_}`.trim();
        }
        let f = u.inclusive ? "<=" : "<",
          m = i(u.origin ?? "value");
        return l?.unit
          ? `${l.longLabel} \u05DE\u05D3\u05D9: ${d} ${m} ${f}${u.maximum.toString()} ${l.unit}`
          : `${l?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC"} \u05DE\u05D3\u05D9: ${d} ${m} ${f}${u.maximum.toString()}`;
      }
      case "too_small": {
        let l = a(u.origin),
          d = r(u.origin ?? "value");
        if (u.origin === "string")
          return `${l?.shortLabel ?? "\u05E7\u05E6\u05E8"} \u05DE\u05D3\u05D9: ${d} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${u.minimum.toString()} ${l?.unit ?? ""} ${u.inclusive ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8" : "\u05DC\u05E4\u05D7\u05D5\u05EA"}`.trim();
        if (u.origin === "number") {
          let v = u.inclusive
            ? `\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${u.minimum}`
            : `\u05D2\u05D3\u05D5\u05DC \u05DE-${u.minimum}`;
          return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${d} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${v}`;
        }
        if (u.origin === "array" || u.origin === "set") {
          let v =
            u.origin === "set"
              ? "\u05E6\u05E8\u05D9\u05DB\u05D4"
              : "\u05E6\u05E8\u05D9\u05DA";
          if (u.minimum === 1 && u.inclusive) {
            let S =
              (u.origin === "set",
              "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3");
            return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${d} ${v} \u05DC\u05D4\u05DB\u05D9\u05DC ${S}`;
          }
          let _ = u.inclusive
            ? `${u.minimum} ${l?.unit ?? ""} \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8`
            : `\u05D9\u05D5\u05EA\u05E8 \u05DE-${u.minimum} ${l?.unit ?? ""}`;
          return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${d} ${v} \u05DC\u05D4\u05DB\u05D9\u05DC ${_}`.trim();
        }
        let f = u.inclusive ? ">=" : ">",
          m = i(u.origin ?? "value");
        return l?.unit
          ? `${l.shortLabel} \u05DE\u05D3\u05D9: ${d} ${m} ${f}${u.minimum.toString()} ${l.unit}`
          : `${l?.shortLabel ?? "\u05E7\u05D8\u05DF"} \u05DE\u05D3\u05D9: ${d} ${m} ${f}${u.minimum.toString()}`;
      }
      case "invalid_format": {
        let l = u;
        if (l.format === "starts_with")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1 "${l.prefix}"`;
        if (l.format === "ends_with")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05E1\u05EA\u05D9\u05D9\u05DD \u05D1 "${l.suffix}"`;
        if (l.format === "includes")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05DB\u05DC\u05D5\u05DC "${l.includes}"`;
        if (l.format === "regex")
          return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05DC\u05EA\u05D1\u05E0\u05D9\u05EA ${l.pattern}`;
        let d = s[l.format],
          f = d?.label ?? l.format,
          v =
            (d?.gender ?? "m") === "f"
              ? "\u05EA\u05E7\u05D9\u05E0\u05D4"
              : "\u05EA\u05E7\u05D9\u05DF";
        return `${f} \u05DC\u05D0 ${v}`;
      }
      case "not_multiple_of":
        return `\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ${u.divisor}`;
      case "unrecognized_keys":
        return `\u05DE\u05E4\u05EA\u05D7${u.keys.length > 1 ? "\u05D5\u05EA" : ""} \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4${u.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4"}: ${g(u.keys, ", ")}`;
      case "invalid_key":
        return "\u05E9\u05D3\u05D4 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8";
      case "invalid_union":
        return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
      case "invalid_element":
        return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1${r(u.origin ?? "array")}`;
      default:
        return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
    }
  };
};
function zp() {
  return { localeError: b_() };
}
var x_ = () => {
  let e = {
    string: {
      unit: "\u0905\u0915\u094D\u0937\u0930",
      verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
    },
    file: {
      unit: "\u092C\u093E\u0907\u091F\u094D\u0938",
      verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
    },
    array: {
      unit: "\u0924\u0924\u094D\u0935",
      verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
    },
    set: {
      unit: "\u0924\u0924\u094D\u0935",
      verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
    },
    map: {
      unit: "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F\u092F\u093E\u0901",
      verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0907\u0928\u092A\u0941\u091F",
      email: "\u0908\u092E\u0947\u0932 \u092A\u0924\u093E",
      url: "URL",
      emoji: "\u0907\u092E\u094B\u091C\u0940",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0924\u093F\u0925\u093F \u0914\u0930 \u0938\u092E\u092F",
      date: "ISO \u0924\u093F\u0925\u093F",
      time: "ISO \u0938\u092E\u092F",
      duration: "ISO \u0905\u0935\u0927\u093F",
      ipv4: "IPv4 \u092A\u0924\u093E",
      ipv6: "IPv6 \u092A\u0924\u093E",
      mac: "MAC \u092A\u0924\u093E",
      cidrv4: "IPv4 \u0936\u094D\u0930\u0947\u0923\u0940",
      cidrv6: "IPv6 \u0936\u094D\u0930\u0947\u0923\u0940",
      base64:
        "Base64-\u090F\u0928\u094D\u0915\u094B\u0921\u0947\u0921 \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
      base64url:
        "Base64URL-\u090F\u0928\u094D\u0915\u094B\u0921\u0947\u0921 \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
      json_string: "JSON \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
      e164: "E.164 \u0938\u0902\u0916\u094D\u092F\u093E",
      credit_card:
        "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0915\u093E\u0930\u094D\u0921 \u0938\u0902\u0916\u094D\u092F\u093E",
      currency_code: "\u092E\u0941\u0926\u094D\u0930\u093E \u0915\u094B\u0921",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0907\u0928\u092A\u0941\u091F",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${i}, \u092A\u094D\u0930\u093E\u092A\u094D\u0924 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${y(r.values[0])}`
          : `\u0905\u092E\u093E\u0928\u094D\u092F \u0935\u093F\u0915\u0932\u094D\u092A: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u092E\u093E\u0928\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 \u090F\u0915 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u092C\u0939\u0941\u0924 \u092C\u0921\u093C\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${r.origin ?? "\u092E\u093E\u0928"} \u092E\u0947\u0902 ${i}${r.maximum} ${a.unit} \u0939\u094B\u0902`
          : `\u092C\u0939\u0941\u0924 \u092C\u0921\u093C\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${r.origin ?? "\u092E\u093E\u0928"} ${i}${r.maximum} \u0939\u094B`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u092C\u0939\u0941\u0924 \u091B\u094B\u091F\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${r.origin} \u092E\u0947\u0902 ${i}${r.minimum} ${a.unit} \u0939\u094B\u0902`
          : `\u092C\u0939\u0941\u0924 \u091B\u094B\u091F\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${r.origin} ${i}${r.minimum} \u0939\u094B`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: "${i.prefix}" \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
          : i.format === "ends_with"
            ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: "${i.suffix}" \u092A\u0930 \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
            : i.format === "includes"
              ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: \u0907\u0938\u092E\u0947\u0902 "${i.includes}" \u0936\u093E\u092E\u093F\u0932 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
              : i.format === "regex"
                ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: \u092A\u0948\u091F\u0930\u094D\u0928 ${i.pattern} \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
                : `\u0905\u092E\u093E\u0928\u094D\u092F ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E: \u092F\u0939 ${r.divisor} \u0915\u093E \u0917\u0941\u0923\u091C \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`;
      case "unrecognized_keys":
        return `\u0905\u092A\u0930\u093F\u091A\u093F\u0924 \u0915\u0941\u0902\u091C\u0940${r.keys.length > 1 ? "\u092F\u093E\u0901" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u0915\u0941\u0902\u091C\u0940: ${r.origin} \u092E\u0947\u0902`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0
          ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0921\u093F\u0938\u094D\u0915\u094D\u0930\u093F\u092E\u093F\u0928\u0947\u091F\u0930 \u092E\u093E\u0928: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${r.options.map((a) => `'${a}'`).join(" | ")}`
          : "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
      case "invalid_element":
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0928: ${r.origin} \u092E\u0947\u0902`;
      default:
        return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
    }
  };
};
function Pp() {
  return { localeError: x_() };
}
var k_ = () => {
  let e = {
    string: { unit: "znakova", verb: "imati" },
    file: { unit: "bajtova", verb: "imati" },
    array: { unit: "stavki", verb: "imati" },
    set: { unit: "stavki", verb: "imati" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "unos",
      email: "email adresa",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datum i vrijeme",
      date: "ISO datum",
      time: "ISO vrijeme",
      duration: "ISO trajanje",
      ipv4: "IPv4 adresa",
      ipv6: "IPv6 adresa",
      mac: "MAC adresa",
      cidrv4: "IPv4 raspon",
      cidrv6: "IPv6 raspon",
      base64: "base64 kodirani tekst",
      base64url: "base64url kodirani tekst",
      json_string: "JSON tekst",
      e164: "E.164 broj",
      credit_card: "broj kreditne kartice",
      currency_code: "kod valute",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "unos",
    },
    o = {
      nan: "NaN",
      string: "tekst",
      number: "broj",
      boolean: "boolean",
      array: "niz",
      object: "objekt",
      set: "skup",
      file: "datoteka",
      date: "datum",
      bigint: "bigint",
      symbol: "simbol",
      undefined: "undefined",
      null: "null",
      function: "funkcija",
      map: "mapa",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Neispravan unos: o\u010Dekuje se instanceof ${r.expected}, a primljeno je ${s}`
          : `Neispravan unos: o\u010Dekuje se ${i}, a primljeno je ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Neispravna vrijednost: o\u010Dekivano ${y(r.values[0])}`
          : `Neispravna opcija: o\u010Dekivano jedno od ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin),
          s = o[r.origin] ?? r.origin;
        return a
          ? `Preveliko: o\u010Dekivano da ${s ?? "vrijednost"} ima ${i}${r.maximum.toString()} ${a.unit ?? "elemenata"}`
          : `Preveliko: o\u010Dekivano da ${s ?? "vrijednost"} bude ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin),
          s = o[r.origin] ?? r.origin;
        return a
          ? `Premalo: o\u010Dekivano da ${s} ima ${i}${r.minimum.toString()} ${a.unit}`
          : `Premalo: o\u010Dekivano da ${s} bude ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Neispravan tekst: mora zapo\u010Dinjati s "${i.prefix}"`
          : i.format === "ends_with"
            ? `Neispravan tekst: mora zavr\u0161avati s "${i.suffix}"`
            : i.format === "includes"
              ? `Neispravan tekst: mora sadr\u017Eavati "${i.includes}"`
              : i.format === "regex"
                ? `Neispravan tekst: mora odgovarati uzorku ${i.pattern}`
                : `Neispravna ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neispravan broj: mora biti vi\u0161ekratnik od ${r.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznat${r.keys.length > 1 ? "i klju\u010Devi" : " klju\u010D"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Neispravan klju\u010D u ${o[r.origin] ?? r.origin}`;
      case "invalid_union":
        return "Neispravan unos";
      case "invalid_element":
        return `Neispravna vrijednost u ${o[r.origin] ?? r.origin}`;
      default:
        return "Neispravan unos";
    }
  };
};
function Op() {
  return { localeError: k_() };
}
var w_ = () => {
  let e = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" },
    map: { unit: "elem", verb: "legyen" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "bemenet",
      email: "email c\xEDm",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO id\u0151b\xE9lyeg",
      date: "ISO d\xE1tum",
      time: "ISO id\u0151",
      duration: "ISO id\u0151intervallum",
      ipv4: "IPv4 c\xEDm",
      ipv6: "IPv6 c\xEDm",
      mac: "MAC c\xEDm",
      cidrv4: "IPv4 tartom\xE1ny",
      cidrv6: "IPv6 tartom\xE1ny",
      base64: "base64-k\xF3dolt string",
      base64url: "base64url-k\xF3dolt string",
      json_string: "JSON string",
      e164: "E.164 sz\xE1m",
      credit_card: "hitelk\xE1rtyasz\xE1m",
      currency_code: "p\xE9nznemk\xF3d",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "bemenet",
    },
    o = { nan: "NaN", number: "sz\xE1m", array: "t\xF6mb" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k instanceof ${r.expected}, a kapott \xE9rt\xE9k ${s}`
          : `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${i}, a kapott \xE9rt\xE9k ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${y(r.values[0])}`
          : `\xC9rv\xE9nytelen opci\xF3: valamelyik \xE9rt\xE9k v\xE1rt ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `T\xFAl nagy: ${r.origin ?? "\xE9rt\xE9k"} m\xE9rete t\xFAl nagy ${i}${r.maximum.toString()} ${a.unit ?? "elem"}`
          : `T\xFAl nagy: a bemeneti \xE9rt\xE9k ${r.origin ?? "\xE9rt\xE9k"} t\xFAl nagy: ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${r.origin} m\xE9rete t\xFAl kicsi ${i}${r.minimum.toString()} ${a.unit}`
          : `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${r.origin} t\xFAl kicsi ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\xC9rv\xE9nytelen string: "${i.prefix}" \xE9rt\xE9kkel kell kezd\u0151dnie`
          : i.format === "ends_with"
            ? `\xC9rv\xE9nytelen string: "${i.suffix}" \xE9rt\xE9kkel kell v\xE9gz\u0151dnie`
            : i.format === "includes"
              ? `\xC9rv\xE9nytelen string: "${i.includes}" \xE9rt\xE9ket kell tartalmaznia`
              : i.format === "regex"
                ? `\xC9rv\xE9nytelen string: ${i.pattern} mint\xE1nak kell megfelelnie`
                : `\xC9rv\xE9nytelen ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\xC9rv\xE9nytelen sz\xE1m: ${r.divisor} t\xF6bbsz\xF6r\xF6s\xE9nek kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\xC9rv\xE9nytelen kulcs ${r.origin}`;
      case "invalid_union":
        return "\xC9rv\xE9nytelen bemenet";
      case "invalid_element":
        return `\xC9rv\xE9nytelen \xE9rt\xE9k: ${r.origin}`;
      default:
        return "\xC9rv\xE9nytelen bemenet";
    }
  };
};
function jp() {
  return { localeError: w_() };
}
function Np(e, t, n) {
  return Math.abs(e) === 1 ? t : n;
}
function rr(e) {
  if (!e) return "";
  let t = [
      "\u0561",
      "\u0565",
      "\u0568",
      "\u056B",
      "\u0578",
      "\u0578\u0582",
      "\u0585",
    ],
    n = e[e.length - 1];
  return e + (t.includes(n) ? "\u0576" : "\u0568");
}
var I_ = () => {
  let e = {
    string: {
      unit: {
        one: "\u0576\u0577\u0561\u0576",
        many: "\u0576\u0577\u0561\u0576\u0576\u0565\u0580",
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
    },
    file: {
      unit: {
        one: "\u0562\u0561\u0575\u0569",
        many: "\u0562\u0561\u0575\u0569\u0565\u0580",
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
    },
    array: {
      unit: {
        one: "\u057F\u0561\u0580\u0580",
        many: "\u057F\u0561\u0580\u0580\u0565\u0580",
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
    },
    set: {
      unit: {
        one: "\u057F\u0561\u0580\u0580",
        many: "\u057F\u0561\u0580\u0580\u0565\u0580",
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
    },
    map: {
      unit: {
        one: "\u057F\u0561\u0580\u0580",
        many: "\u057F\u0561\u0580\u0580\u0565\u0580",
      },
      verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0574\u0578\u0582\u057F\u0584",
      email: "\u0567\u056C. \u0570\u0561\u057D\u0581\u0565",
      url: "URL",
      emoji: "\u0567\u0574\u0578\u057B\u056B",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E \u0587 \u056A\u0561\u0574",
      date: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E",
      time: "ISO \u056A\u0561\u0574",
      duration:
        "ISO \u057F\u0587\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
      ipv4: "IPv4 \u0570\u0561\u057D\u0581\u0565",
      ipv6: "IPv6 \u0570\u0561\u057D\u0581\u0565",
      mac: "MAC \u0570\u0561\u057D\u0581\u0565",
      cidrv4: "IPv4 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
      cidrv6: "IPv6 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
      base64:
        "base64 \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
      base64url:
        "base64url \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
      json_string: "JSON \u057F\u0578\u0572",
      e164: "E.164 \u0570\u0561\u0574\u0561\u0580",
      credit_card:
        "\u056F\u0580\u0565\u0564\u056B\u057F \u0584\u0561\u0580\u057F\u056B \u0570\u0561\u0574\u0561\u0580",
      currency_code:
        "\u0561\u0580\u056A\u0578\u0582\u0575\u0569\u056B \u056F\u0578\u0564",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0574\u0578\u0582\u057F\u0584",
    },
    o = {
      nan: "NaN",
      number: "\u0569\u056B\u057E",
      array: "\u0566\u0561\u0576\u0563\u057E\u0561\u056E",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 instanceof ${r.expected}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${s}`
          : `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${i}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${y(r.values[1])}`
          : `\u054D\u056D\u0561\u056C \u057F\u0561\u0580\u0562\u0565\u0580\u0561\u056F\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 \u0570\u0565\u057F\u0587\u0575\u0561\u056C\u0576\u0565\u0580\u056B\u0581 \u0574\u0565\u056F\u0568\u055D ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        if (a) {
          let s = Number(r.maximum),
            c = Np(s, a.unit.one, a.unit.many);
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${rr(r.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${rr(r.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056C\u056B\u0576\u056B ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        if (a) {
          let s = Number(r.minimum),
            c = Np(s, a.unit.one, a.unit.many);
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${rr(r.origin)} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${i}${r.minimum.toString()} ${c}`;
        }
        return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${rr(r.origin)} \u056C\u056B\u0576\u056B ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057D\u056F\u057D\u057E\u056B "${i.prefix}"-\u0578\u057E`
          : i.format === "ends_with"
            ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0561\u057E\u0561\u0580\u057F\u057E\u056B "${i.suffix}"-\u0578\u057E`
            : i.format === "includes"
              ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057A\u0561\u0580\u0578\u0582\u0576\u0561\u056F\u056B "${i.includes}"`
              : i.format === "regex"
                ? `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0570\u0561\u0574\u0561\u057A\u0561\u057F\u0561\u057D\u056D\u0561\u0576\u056B ${i.pattern} \u0571\u0587\u0561\u0579\u0561\u0583\u056B\u0576`
                : `\u054D\u056D\u0561\u056C ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u054D\u056D\u0561\u056C \u0569\u056B\u057E\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0562\u0561\u0566\u0574\u0561\u057A\u0561\u057F\u056B\u056F \u056C\u056B\u0576\u056B ${r.divisor}-\u056B`;
      case "unrecognized_keys":
        return `\u0549\u0573\u0561\u0576\u0561\u0579\u057E\u0561\u056E \u0562\u0561\u0576\u0561\u056C\u056B${r.keys.length > 1 ? "\u0576\u0565\u0580" : ""}. ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u054D\u056D\u0561\u056C \u0562\u0561\u0576\u0561\u056C\u056B ${rr(r.origin)}-\u0578\u0582\u0574`;
      case "invalid_union":
        return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
      case "invalid_element":
        return `\u054D\u056D\u0561\u056C \u0561\u0580\u056A\u0565\u0584 ${rr(r.origin)}-\u0578\u0582\u0574`;
      default:
        return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
    }
  };
};
function Tp() {
  return { localeError: I_() };
}
var S_ = () => {
  let e = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" },
    map: { unit: "item", verb: "memiliki" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "input",
      email: "alamat email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "tanggal dan waktu format ISO",
      date: "tanggal format ISO",
      time: "jam format ISO",
      duration: "durasi format ISO",
      ipv4: "alamat IPv4",
      ipv6: "alamat IPv6",
      mac: "alamat MAC",
      cidrv4: "rentang alamat IPv4",
      cidrv6: "rentang alamat IPv6",
      base64: "string dengan enkode base64",
      base64url: "string dengan enkode base64url",
      json_string: "string JSON",
      e164: "angka E.164",
      credit_card: "nomor kartu kredit",
      currency_code: "kode mata uang",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Input tidak valid: diharapkan instanceof ${r.expected}, diterima ${s}`
          : `Input tidak valid: diharapkan ${i}, diterima ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Input tidak valid: diharapkan ${y(r.values[0])}`
          : `Pilihan tidak valid: diharapkan salah satu dari ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Terlalu besar: diharapkan ${r.origin ?? "value"} memiliki ${i}${r.maximum.toString()} ${a.unit ?? "elemen"}`
          : `Terlalu besar: diharapkan ${r.origin ?? "value"} menjadi ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Terlalu kecil: diharapkan ${r.origin} memiliki ${i}${r.minimum.toString()} ${a.unit}`
          : `Terlalu kecil: diharapkan ${r.origin} menjadi ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `String tidak valid: harus dimulai dengan "${i.prefix}"`
          : i.format === "ends_with"
            ? `String tidak valid: harus berakhir dengan "${i.suffix}"`
            : i.format === "includes"
              ? `String tidak valid: harus menyertakan "${i.includes}"`
              : i.format === "regex"
                ? `String tidak valid: harus sesuai pola ${i.pattern}`
                : `${n[i.format] ?? r.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${r.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${r.origin}`;
      default:
        return "Input tidak valid";
    }
  };
};
function Ap() {
  return { localeError: S_() };
}
var z_ = () => {
  let e = {
    string: { unit: "stafi", verb: "a\xF0 hafa" },
    file: { unit: "b\xE6ti", verb: "a\xF0 hafa" },
    array: { unit: "hluti", verb: "a\xF0 hafa" },
    set: { unit: "hluti", verb: "a\xF0 hafa" },
    map: { unit: "hluti", verb: "a\xF0 hafa" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "gildi",
      email: "netfang",
      url: "vefsl\xF3\xF0",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO dagsetning og t\xEDmi",
      date: "ISO dagsetning",
      time: "ISO t\xEDmi",
      duration: "ISO t\xEDmalengd",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      mac: "MAC address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded strengur",
      base64url: "base64url-encoded strengur",
      json_string: "JSON strengur",
      e164: "E.164 t\xF6lugildi",
      credit_card: "kreditkortan\xFAmer",
      currency_code: "gjaldmi\xF0ilsk\xF3\xF0i",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "gildi",
    },
    o = { nan: "NaN", number: "n\xFAmer", array: "fylki" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Rangt gildi: \xDE\xFA sl\xF3st inn ${s} \xFEar sem \xE1 a\xF0 vera instanceof ${r.expected}`
          : `Rangt gildi: \xDE\xFA sl\xF3st inn ${s} \xFEar sem \xE1 a\xF0 vera ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Rangt gildi: gert r\xE1\xF0 fyrir ${y(r.values[0])}`
          : `\xD3gilt val: m\xE1 vera eitt af eftirfarandi ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin ?? "gildi"} hafi ${i}${r.maximum.toString()} ${a.unit ?? "hluti"}`
          : `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin ?? "gildi"} s\xE9 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin} hafi ${i}${r.minimum.toString()} ${a.unit}`
          : `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${r.origin} s\xE9 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\xD3gildur strengur: ver\xF0ur a\xF0 byrja \xE1 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\xD3gildur strengur: ver\xF0ur a\xF0 enda \xE1 "${i.suffix}"`
            : i.format === "includes"
              ? `\xD3gildur strengur: ver\xF0ur a\xF0 innihalda "${i.includes}"`
              : i.format === "regex"
                ? `\xD3gildur strengur: ver\xF0ur a\xF0 fylgja mynstri ${i.pattern}`
                : `Rangt ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `R\xF6ng tala: ver\xF0ur a\xF0 vera margfeldi af ${r.divisor}`;
      case "unrecognized_keys":
        return `\xD3\xFEekkt ${r.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill \xED ${r.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi \xED ${r.origin}`;
      default:
        return "Rangt gildi";
    }
  };
};
function Dp() {
  return { localeError: z_() };
}
var P_ = () => {
  let e = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" },
    map: { unit: "elementi", verb: "avere" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "input",
      email: "indirizzo email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "data e ora ISO",
      date: "data ISO",
      time: "ora ISO",
      duration: "durata ISO",
      ipv4: "indirizzo IPv4",
      ipv6: "indirizzo IPv6",
      mac: "indirizzo MAC",
      cidrv4: "intervallo IPv4",
      cidrv6: "intervallo IPv6",
      base64: "stringa codificata in base64",
      base64url: "URL codificata in base64",
      json_string: "stringa JSON",
      e164: "numero E.164",
      credit_card: "numero di carta di credito",
      currency_code: "codice valuta",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = { nan: "NaN", number: "numero", array: "vettore" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Input non valido: atteso instanceof ${r.expected}, ricevuto ${s}`
          : `Input non valido: atteso ${i}, ricevuto ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Input non valido: atteso ${y(r.values[0])}`
          : `Opzione non valida: atteso uno tra ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Troppo grande: ${r.origin ?? "valore"} deve avere ${i}${r.maximum.toString()} ${a.unit ?? "elementi"}`
          : `Troppo grande: ${r.origin ?? "valore"} deve essere ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Troppo piccolo: ${r.origin} deve avere ${i}${r.minimum.toString()} ${a.unit}`
          : `Troppo piccolo: ${r.origin} deve essere ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Stringa non valida: deve iniziare con "${i.prefix}"`
          : i.format === "ends_with"
            ? `Stringa non valida: deve terminare con "${i.suffix}"`
            : i.format === "includes"
              ? `Stringa non valida: deve includere "${i.includes}"`
              : i.format === "regex"
                ? `Stringa non valida: deve corrispondere al pattern ${i.pattern}`
                : `Input non valido: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${r.divisor}`;
      case "unrecognized_keys":
        return `Chiav${r.keys.length > 1 ? "i" : "e"} non riconosciut${r.keys.length > 1 ? "e" : "a"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${r.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${r.origin}`;
      default:
        return "Input non valido";
    }
  };
};
function Up() {
  return { localeError: P_() };
}
var O_ = () => {
  let e = {
    string: { unit: "\u6587\u5B57", verb: "\u3067\u3042\u308B" },
    file: { unit: "\u30D0\u30A4\u30C8", verb: "\u3067\u3042\u308B" },
    array: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
    set: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
    map: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u5165\u529B\u5024",
      email: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
      url: "URL",
      emoji: "\u7D75\u6587\u5B57",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO\u65E5\u6642",
      date: "ISO\u65E5\u4ED8",
      time: "ISO\u6642\u523B",
      duration: "ISO\u671F\u9593",
      ipv4: "IPv4\u30A2\u30C9\u30EC\u30B9",
      ipv6: "IPv6\u30A2\u30C9\u30EC\u30B9",
      mac: "MAC\u30A2\u30C9\u30EC\u30B9",
      cidrv4: "IPv4\u7BC4\u56F2",
      cidrv6: "IPv6\u7BC4\u56F2",
      base64: "base64\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
      base64url: "base64url\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
      json_string: "JSON\u6587\u5B57\u5217",
      e164: "E.164\u756A\u53F7",
      credit_card:
        "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u756A\u53F7",
      currency_code: "\u901A\u8CA8\u30B3\u30FC\u30C9",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u5165\u529B\u5024",
    },
    o = { nan: "NaN", number: "\u6570\u5024", array: "\u914D\u5217" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u7121\u52B9\u306A\u5165\u529B: instanceof ${r.expected}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${s}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`
          : `\u7121\u52B9\u306A\u5165\u529B: ${i}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${s}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u7121\u52B9\u306A\u5165\u529B: ${y(r.values[0])}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F`
          : `\u7121\u52B9\u306A\u9078\u629E: ${g(r.values, "\u3001")}\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      case "too_big": {
        let i = r.inclusive
            ? "\u4EE5\u4E0B\u3067\u3042\u308B"
            : "\u3088\u308A\u5C0F\u3055\u3044",
          a = t(r.origin);
        return a
          ? `\u5927\u304D\u3059\u304E\u308B\u5024: ${r.origin ?? "\u5024"}\u306F${r.maximum.toString()}${a.unit ?? "\u8981\u7D20"}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`
          : `\u5927\u304D\u3059\u304E\u308B\u5024: ${r.origin ?? "\u5024"}\u306F${r.maximum.toString()}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      }
      case "too_small": {
        let i = r.inclusive
            ? "\u4EE5\u4E0A\u3067\u3042\u308B"
            : "\u3088\u308A\u5927\u304D\u3044",
          a = t(r.origin);
        return a
          ? `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${r.origin}\u306F${r.minimum.toString()}${a.unit}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`
          : `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${r.origin}\u306F${r.minimum.toString()}${i}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${i.prefix}"\u3067\u59CB\u307E\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`
          : i.format === "ends_with"
            ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${i.suffix}"\u3067\u7D42\u308F\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`
            : i.format === "includes"
              ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${i.includes}"\u3092\u542B\u3080\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`
              : i.format === "regex"
                ? `\u7121\u52B9\u306A\u6587\u5B57\u5217: \u30D1\u30BF\u30FC\u30F3${i.pattern}\u306B\u4E00\u81F4\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`
                : `\u7121\u52B9\u306A${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u7121\u52B9\u306A\u6570\u5024: ${r.divisor}\u306E\u500D\u6570\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
      case "unrecognized_keys":
        return `\u8A8D\u8B58\u3055\u308C\u3066\u3044\u306A\u3044\u30AD\u30FC${r.keys.length > 1 ? "\u7FA4" : ""}: ${g(r.keys, "\u3001")}`;
      case "invalid_key":
        return `${r.origin}\u5185\u306E\u7121\u52B9\u306A\u30AD\u30FC`;
      case "invalid_union":
        return "\u7121\u52B9\u306A\u5165\u529B";
      case "invalid_element":
        return `${r.origin}\u5185\u306E\u7121\u52B9\u306A\u5024`;
      default:
        return "\u7121\u52B9\u306A\u5165\u529B";
    }
  };
};
function Ep() {
  return { localeError: O_() };
}
var j_ = () => {
  let e = {
    string: {
      unit: "\u10E1\u10D8\u10DB\u10D1\u10DD\u10DA\u10DD",
      verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
    },
    file: {
      unit: "\u10D1\u10D0\u10D8\u10E2\u10D8",
      verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
    },
    array: {
      unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
      verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
    },
    set: {
      unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
      verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
    },
    map: {
      unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
      verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
      email:
        "\u10D4\u10DA-\u10E4\u10DD\u10E1\u10E2\u10D8\u10E1 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
      url: "URL",
      emoji: "\u10D4\u10DB\u10DD\u10EF\u10D8",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8-\u10D3\u10E0\u10DD",
      date: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8",
      time: "\u10D3\u10E0\u10DD",
      duration:
        "\u10EE\u10D0\u10DC\u10D2\u10E0\u10EB\u10DA\u10D8\u10D5\u10DD\u10D1\u10D0",
      ipv4: "IPv4 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
      ipv6: "IPv6 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
      mac: "MAC \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
      cidrv4: "IPv4 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
      cidrv6: "IPv6 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
      base64:
        "base64-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
      base64url:
        "base64url-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
      json_string: "JSON \u10D5\u10D4\u10DA\u10D8",
      e164: "E.164 \u10DC\u10DD\u10DB\u10D4\u10E0\u10D8",
      credit_card:
        "\u10E1\u10D0\u10D9\u10E0\u10D4\u10D3\u10D8\u10E2\u10DD \u10D1\u10D0\u10E0\u10D0\u10D7\u10D8\u10E1 \u10DC\u10DD\u10DB\u10D4\u10E0\u10D8",
      currency_code:
        "\u10D5\u10D0\u10DA\u10E3\u10E2\u10D8\u10E1 \u10D9\u10DD\u10D3\u10D8",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
    },
    o = {
      nan: "NaN",
      number: "\u10E0\u10D8\u10EA\u10EE\u10D5\u10D8",
      string: "\u10D5\u10D4\u10DA\u10D8",
      boolean: "\u10D1\u10E3\u10DA\u10D4\u10D0\u10DC\u10D8",
      function: "\u10E4\u10E3\u10DC\u10E5\u10EA\u10D8\u10D0",
      array: "\u10DB\u10D0\u10E1\u10D8\u10D5\u10D8",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 instanceof ${r.expected}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${s}`
          : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${i}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${y(r.values[0])}`
          : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D0\u10E0\u10D8\u10D0\u10DC\u10E2\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8\u10D0 \u10D4\u10E0\u10D7-\u10D4\u10E0\u10D7\u10D8 ${g(r.values, "|")}-\u10D3\u10D0\u10DC`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit}`
          : `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} \u10D8\u10E7\u10DD\u10E1 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}`
          : `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${r.origin} \u10D8\u10E7\u10DD\u10E1 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10EC\u10E7\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${i.prefix}"-\u10D8\u10D7`
          : i.format === "ends_with"
            ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10DB\u10D7\u10D0\u10D5\u10E0\u10D3\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${i.suffix}"-\u10D8\u10D7`
            : i.format === "includes"
              ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1 "${i.includes}"-\u10E1`
              : i.format === "regex"
                ? `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D4\u10E1\u10D0\u10D1\u10D0\u10DB\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 \u10E8\u10D0\u10D1\u10DA\u10DD\u10DC\u10E1 ${i.pattern}`
                : `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E0\u10D8\u10EA\u10EE\u10D5\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10E7\u10DD\u10E1 ${r.divisor}-\u10D8\u10E1 \u10EF\u10D4\u10E0\u10D0\u10D3\u10D8`;
      case "unrecognized_keys":
        return `\u10E3\u10EA\u10DC\u10DD\u10D1\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1${r.keys.length > 1 ? "\u10D4\u10D1\u10D8" : "\u10D8"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1\u10D8 ${r.origin}-\u10E8\u10D8`;
      case "invalid_union":
        return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
      case "invalid_element":
        return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0 ${r.origin}-\u10E8\u10D8`;
      default:
        return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
    }
  };
};
function Zp() {
  return { localeError: j_() };
}
var N_ = () => {
  let e = {
    string: {
      unit: "\u178F\u17BD\u17A2\u1780\u17D2\u179F\u179A",
      verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
    },
    file: {
      unit: "\u1794\u17C3",
      verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
    },
    array: {
      unit: "\u1792\u17B6\u178F\u17BB",
      verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
    },
    set: {
      unit: "\u1792\u17B6\u178F\u17BB",
      verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
    },
    map: {
      unit: "\u1792\u17B6\u178F\u17BB",
      verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex:
        "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
      email:
        "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793\u17A2\u17CA\u17B8\u1798\u17C2\u179B",
      url: "URL",
      emoji:
        "\u179F\u1789\u17D2\u1789\u17B6\u17A2\u17B6\u179A\u1798\u17D2\u1798\u178E\u17CD",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 \u1793\u17B7\u1784\u1798\u17C9\u17C4\u1784 ISO",
      date: "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 ISO",
      time: "\u1798\u17C9\u17C4\u1784 ISO",
      duration: "\u179A\u1799\u17C8\u1796\u17C1\u179B ISO",
      ipv4: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
      ipv6: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
      mac: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 MAC",
      cidrv4:
        "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
      cidrv6:
        "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
      base64:
        "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64",
      base64url:
        "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64url",
      json_string:
        "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A JSON",
      e164: "\u179B\u17C1\u1781 E.164",
      credit_card:
        "\u179B\u17C1\u1781\u1794\u17D0\u178E\u17D2\u178E\u17A5\u178E\u1791\u17B6\u1793",
      currency_code:
        "\u1780\u17BC\u178A\u179A\u17BC\u1794\u17B7\u1799\u1794\u17D0\u178E\u17D2\u178E",
      iban: "IBAN",
      jwt: "JWT",
      template_literal:
        "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
    },
    o = {
      nan: "NaN",
      number: "\u179B\u17C1\u1781",
      array: "\u17A2\u17B6\u179A\u17C1 (Array)",
      null: "\u1782\u17D2\u1798\u17B6\u1793\u178F\u1798\u17D2\u179B\u17C3 (null)",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A instanceof ${r.expected} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${s}`
          : `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${i} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${y(r.values[0])}`
          : `\u1787\u1798\u17D2\u179A\u17BE\u179F\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1787\u17B6\u1798\u17BD\u1799\u1780\u17D2\u1793\u17BB\u1784\u1785\u17C6\u178E\u17C4\u1798 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${i} ${r.maximum.toString()} ${a.unit ?? "\u1792\u17B6\u178F\u17BB"}`
          : `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin} ${i} ${r.minimum.toString()} ${a.unit}`
          : `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${r.origin} ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798\u178A\u17C4\u1799 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1794\u1789\u17D2\u1785\u1794\u17CB\u178A\u17C4\u1799 "${i.suffix}"`
            : i.format === "includes"
              ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1798\u17B6\u1793 "${i.includes}"`
              : i.format === "regex"
                ? `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1793\u17B9\u1784\u1791\u1798\u17D2\u179A\u1784\u17CB\u178A\u17C2\u179B\u1794\u17B6\u1793\u1780\u17C6\u178E\u178F\u17CB ${i.pattern}`
                : `\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u179B\u17C1\u1781\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1787\u17B6\u1796\u17A0\u17BB\u1782\u17BB\u178E\u1793\u17C3 ${r.divisor}`;
      case "unrecognized_keys":
        return `\u179A\u1780\u1783\u17BE\u1789\u179F\u17C4\u1798\u17B7\u1793\u179F\u17D2\u1782\u17B6\u179B\u17CB\u17D6 ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u179F\u17C4\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${r.origin}`;
      case "invalid_union":
        return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C";
      case "invalid_element":
        return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${r.origin}`;
      default:
        return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C";
    }
  };
};
function io() {
  return { localeError: N_() };
}
function Cp() {
  return io();
}
var T_ = () => {
  let e = {
    string: {
      unit: "\u0C85\u0C95\u0CCD\u0CB7\u0CB0\u0C97\u0CB3\u0CC1",
      verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
    },
    file: {
      unit: "\u0CAC\u0CC8\u0C9F\u0CCD\u200C\u0C97\u0CB3\u0CC1",
      verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
    },
    array: {
      unit: "\u0CB5\u0CB8\u0CCD\u0CA4\u0CC1\u0C97\u0CB3\u0CC1",
      verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
    },
    set: {
      unit: "\u0CB5\u0CB8\u0CCD\u0CA4\u0CC1\u0C97\u0CB3\u0CC1",
      verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
    },
    map: { unit: "entries", verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0C87\u0CA8\u0CCD\u0CAA\u0CC1\u0C9F\u0CCD",
      email: "email \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u0CA6\u0CBF\u0CA8\u0CBE\u0C82\u0C95\u0CA6 \u0CB8\u0CAE\u0CAF",
      date: "ISO \u0CA6\u0CBF\u0CA8\u0CBE\u0C82\u0C95",
      time: "ISO \u0CB8\u0CAE\u0CAF",
      duration: "ISO \u0C85\u0CB5\u0CA7\u0CBF",
      ipv4: "IPv4 \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
      ipv6: "IPv6 \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
      mac: "MAC \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
      cidrv4: "IPv4 \u0CB5\u0CCD\u0CAF\u0CBE\u0CAA\u0CCD\u0CA4\u0CBF\u0CAF",
      cidrv6: "IPv6 \u0CB5\u0CCD\u0CAF\u0CBE\u0CAA\u0CCD\u0CA4\u0CBF\u0CAF",
      base64:
        "base64-encoded\u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD",
      base64url:
        "base64url-encoded\u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD",
      json_string: "JSON\u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD",
      e164: "E.164 \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6",
      credit_card:
        "\u0C95\u0CCD\u0CB0\u0CC6\u0CA1\u0CBF\u0C9F\u0CCD \u0C95\u0CBE\u0CB0\u0CCD\u0CA1\u0CCD \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6",
      currency_code:
        "\u0C95\u0CB0\u0CC6\u0CA8\u0CCD\u0CB8\u0CBF \u0C95\u0CCB\u0CA1\u0CCD",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0C87\u0CA8\u0CCD\u0CAA\u0CC1\u0C9F\u0CCD",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${i}, \u0CB8\u0CCD\u0CB5\u0CC0\u0C95\u0CB0\u0CBF\u0CB8\u0CBF\u0CA6\u0CA8\u0CC1 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${y(r.values[0])}`
          : `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C86\u0CAF\u0CCD\u0C95\u0CC6: \u0C87\u0CB5\u0CC1\u0C97\u0CB3\u0CB2\u0CCD\u0CB2\u0CBF \u0C92\u0C82\u0CA6\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0CA6\u0CCA\u0CA1\u0CCD\u0CA1\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${r.origin ?? "value"} \u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1 ${i}${r.maximum.toString()} ${a.unit ?? "\u0C85\u0C82\u0CB6\u0C97\u0CB3\u0CC1"}`
          : `\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0CA6\u0CCA\u0CA1\u0CCD\u0CA1\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${r.origin ?? "value"} \u0C8E\u0C82\u0CA6\u0CC1 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0C9A\u0CBF\u0C95\u0CCD\u0C95\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${r.origin} \u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1 ${i}${r.minimum.toString()} ${a.unit}`
          : `\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0C9A\u0CBF\u0C95\u0CCD\u0C95\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${r.origin} \u0C8E\u0C82\u0CA6\u0CC1 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0C87\u0CA6\u0CB0\u0CCA\u0C82\u0CA6\u0CBF\u0C97\u0CC6 \u0CAA\u0CCD\u0CB0\u0CBE\u0CB0\u0C82\u0CAD\u0CBF\u0CB8\u0CAC\u0CC7\u0C95\u0CC1 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0C87\u0CA6\u0CB0\u0CCA\u0C82\u0CA6\u0CBF\u0C97\u0CC6 \u0C95\u0CCA\u0CA8\u0CC6\u0C97\u0CCA\u0CB3\u0CCD\u0CB3\u0CAC\u0CC7\u0C95\u0CC1 "${i.suffix}"`
            : i.format === "includes"
              ? `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0C92\u0CB3\u0C97\u0CCA\u0C82\u0CA1\u0CBF\u0CB0\u0CAC\u0CC7\u0C95\u0CC1 "${i.includes}"`
              : i.format === "regex"
                ? `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0CAE\u0CBE\u0CA6\u0CB0\u0CBF\u0C97\u0CC6 \u0CB9\u0CCA\u0C82\u0CA6\u0CBF\u0C95\u0CC6\u0CAF\u0CBE\u0C97\u0CAC\u0CC7\u0C95\u0CC1 ${i.pattern}`
                : `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6: \u0CAC\u0CB9\u0CC1\u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CB0\u0CAC\u0CC7\u0C95\u0CC1 ${r.divisor}`;
      case "unrecognized_keys":
        return `\u0C97\u0CC1\u0CB0\u0CC1\u0CA4\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CA6 \u0C95\u0CC0 ${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0C95\u0CC0 \u0C87\u0CA8\u0CCD ${r.origin}`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0
          ? `\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CA4\u0CBE\u0CB0\u0CA4\u0CAE\u0CCD\u0CAF \u0CAE\u0CCC\u0CB2\u0CCD\u0CAF. \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ${r.options.map((a) => `'${a}'`).join(" | ")}`
          : "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD";
      case "invalid_element":
        return `\u0CB0\u0CB2\u0CCD\u0CB2\u0CBF \u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CAE\u0CCC\u0CB2\u0CCD\u0CAF ${r.origin}`;
      default:
        return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD";
    }
  };
};
function Lp() {
  return { localeError: T_() };
}
var A_ = () => {
  let e = {
    string: { unit: "\uBB38\uC790", verb: "to have" },
    file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
    array: { unit: "\uAC1C", verb: "to have" },
    set: { unit: "\uAC1C", verb: "to have" },
    map: { unit: "\uAC1C", verb: "to have" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\uC785\uB825",
      email: "\uC774\uBA54\uC77C \uC8FC\uC18C",
      url: "URL",
      emoji: "\uC774\uBAA8\uC9C0",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \uB0A0\uC9DC\uC2DC\uAC04",
      date: "ISO \uB0A0\uC9DC",
      time: "ISO \uC2DC\uAC04",
      duration: "ISO \uAE30\uAC04",
      ipv4: "IPv4 \uC8FC\uC18C",
      ipv6: "IPv6 \uC8FC\uC18C",
      mac: "MAC \uC8FC\uC18C",
      cidrv4: "IPv4 \uBC94\uC704",
      cidrv6: "IPv6 \uBC94\uC704",
      base64: "base64 \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
      base64url: "base64url \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
      json_string: "JSON \uBB38\uC790\uC5F4",
      e164: "E.164 \uBC88\uD638",
      credit_card: "\uC2E0\uC6A9\uCE74\uB4DC \uBC88\uD638",
      currency_code: "\uD1B5\uD654 \uCF54\uB4DC",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\uC785\uB825",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof ${r.expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${s}\uC785\uB2C8\uB2E4`
          : `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 ${i}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${s}\uC785\uB2C8\uB2E4`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ${y(r.values[0])} \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4`
          : `\uC798\uBABB\uB41C \uC635\uC158: ${g(r.values, "\uB610\uB294 ")} \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
      case "too_big": {
        let i = r.inclusive ? "\uC774\uD558" : "\uBBF8\uB9CC",
          a =
            i === "\uBBF8\uB9CC"
              ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
              : "\uC5EC\uC57C \uD569\uB2C8\uB2E4",
          s = t(r.origin),
          c = s?.unit ?? "\uC694\uC18C";
        return s
          ? `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${r.maximum.toString()}${c} ${i}${a}`
          : `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${r.maximum.toString()} ${i}${a}`;
      }
      case "too_small": {
        let i = r.inclusive ? "\uC774\uC0C1" : "\uCD08\uACFC",
          a =
            i === "\uC774\uC0C1"
              ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
              : "\uC5EC\uC57C \uD569\uB2C8\uB2E4",
          s = t(r.origin),
          c = s?.unit ?? "\uC694\uC18C";
        return s
          ? `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${r.minimum.toString()}${c} ${i}${a}`
          : `${r.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${r.minimum.toString()} ${i}${a}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.prefix}"(\uC73C)\uB85C \uC2DC\uC791\uD574\uC57C \uD569\uB2C8\uB2E4`
          : i.format === "ends_with"
            ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.suffix}"(\uC73C)\uB85C \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4`
            : i.format === "includes"
              ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.includes}"\uC744(\uB97C) \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4`
              : i.format === "regex"
                ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: \uC815\uADDC\uC2DD ${i.pattern} \uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4`
                : `\uC798\uBABB\uB41C ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\uC798\uBABB\uB41C \uC22B\uC790: ${r.divisor}\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
      case "unrecognized_keys":
        return `\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\uC798\uBABB\uB41C \uD0A4: ${r.origin}`;
      case "invalid_union":
        return "\uC798\uBABB\uB41C \uC785\uB825";
      case "invalid_element":
        return `\uC798\uBABB\uB41C \uAC12: ${r.origin}`;
      default:
        return "\uC798\uBABB\uB41C \uC785\uB825";
    }
  };
};
function Rp() {
  return { localeError: A_() };
}
var kn = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function Vp(e) {
  let t = Math.abs(e),
    n = t % 10,
    o = t % 100;
  return (o >= 11 && o <= 19) || n === 0 ? "many" : n === 1 ? "one" : "few";
}
var D_ = () => {
  let e = {
    string: {
      unit: { one: "simbolis", few: "simboliai", many: "simboli\u0173" },
      verb: {
        smaller: {
          inclusive: "turi b\u016Bti ne ilgesn\u0117 kaip",
          notInclusive: "turi b\u016Bti trumpesn\u0117 kaip",
        },
        bigger: {
          inclusive: "turi b\u016Bti ne trumpesn\u0117 kaip",
          notInclusive: "turi b\u016Bti ilgesn\u0117 kaip",
        },
      },
    },
    file: {
      unit: { one: "baitas", few: "baitai", many: "bait\u0173" },
      verb: {
        smaller: {
          inclusive: "turi b\u016Bti ne didesnis kaip",
          notInclusive: "turi b\u016Bti ma\u017Eesnis kaip",
        },
        bigger: {
          inclusive: "turi b\u016Bti ne ma\u017Eesnis kaip",
          notInclusive: "turi b\u016Bti didesnis kaip",
        },
      },
    },
    array: {
      unit: { one: "element\u0105", few: "elementus", many: "element\u0173" },
      verb: {
        smaller: {
          inclusive: "turi tur\u0117ti ne daugiau kaip",
          notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
        },
        bigger: {
          inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
          notInclusive: "turi tur\u0117ti daugiau kaip",
        },
      },
    },
    set: {
      unit: { one: "element\u0105", few: "elementus", many: "element\u0173" },
      verb: {
        smaller: {
          inclusive: "turi tur\u0117ti ne daugiau kaip",
          notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
        },
        bigger: {
          inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
          notInclusive: "turi tur\u0117ti daugiau kaip",
        },
      },
    },
  };
  function t(r, i, a, s) {
    let c = e[r] ?? null;
    return c === null
      ? c
      : { unit: c.unit[i], verb: c.verb[s][a ? "inclusive" : "notInclusive"] };
  }
  let n = {
      regex: "\u012Fvestis",
      email: "el. pa\u0161to adresas",
      url: "URL",
      emoji: "jaustukas",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO data ir laikas",
      date: "ISO data",
      time: "ISO laikas",
      duration: "ISO trukm\u0117",
      ipv4: "IPv4 adresas",
      ipv6: "IPv6 adresas",
      mac: "MAC adresas",
      cidrv4: "IPv4 tinklo prefiksas (CIDR)",
      cidrv6: "IPv6 tinklo prefiksas (CIDR)",
      base64: "base64 u\u017Ekoduota eilut\u0117",
      base64url: "base64url u\u017Ekoduota eilut\u0117",
      json_string: "JSON eilut\u0117",
      e164: "E.164 numeris",
      credit_card: "kredito kortel\u0117s numeris",
      currency_code: "valiutos kodas",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u012Fvestis",
    },
    o = {
      nan: "NaN",
      number: "skai\u010Dius",
      bigint: "sveikasis skai\u010Dius",
      string: "eilut\u0117",
      boolean: "login\u0117 reik\u0161m\u0117",
      undefined: "neapibr\u0117\u017Eta reik\u0161m\u0117",
      function: "funkcija",
      symbol: "simbolis",
      array: "masyvas",
      object: "objektas",
      null: "nulin\u0117 reik\u0161m\u0117",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Gautas tipas ${s}, o tik\u0117tasi - instanceof ${r.expected}`
          : `Gautas tipas ${s}, o tik\u0117tasi - ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Privalo b\u016Bti ${y(r.values[0])}`
          : `Privalo b\u016Bti vienas i\u0161 ${g(r.values, "|")} pasirinkim\u0173`;
      case "too_big": {
        let i = o[r.origin] ?? r.origin,
          a = t(r.origin, Vp(Number(r.maximum)), r.inclusive ?? !1, "smaller");
        if (a?.verb)
          return `${kn(i ?? r.origin ?? "reik\u0161m\u0117")} ${a.verb} ${r.maximum.toString()} ${a.unit ?? "element\u0173"}`;
        let s = r.inclusive ? "ne didesnis kaip" : "ma\u017Eesnis kaip";
        return `${kn(i ?? r.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${s} ${r.maximum.toString()} ${a?.unit}`;
      }
      case "too_small": {
        let i = o[r.origin] ?? r.origin,
          a = t(r.origin, Vp(Number(r.minimum)), r.inclusive ?? !1, "bigger");
        if (a?.verb)
          return `${kn(i ?? r.origin ?? "reik\u0161m\u0117")} ${a.verb} ${r.minimum.toString()} ${a.unit ?? "element\u0173"}`;
        let s = r.inclusive ? "ne ma\u017Eesnis kaip" : "didesnis kaip";
        return `${kn(i ?? r.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${s} ${r.minimum.toString()} ${a?.unit}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Eilut\u0117 privalo prasid\u0117ti "${i.prefix}"`
          : i.format === "ends_with"
            ? `Eilut\u0117 privalo pasibaigti "${i.suffix}"`
            : i.format === "includes"
              ? `Eilut\u0117 privalo \u012Ftraukti "${i.includes}"`
              : i.format === "regex"
                ? `Eilut\u0117 privalo atitikti ${i.pattern}`
                : `Neteisingas ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Skai\u010Dius privalo b\u016Bti ${r.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpa\u017Eint${r.keys.length > 1 ? "i" : "as"} rakt${r.keys.length > 1 ? "ai" : "as"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga \u012Fvestis";
      case "invalid_element": {
        let i = o[r.origin] ?? r.origin;
        return `${kn(i ?? r.origin ?? "reik\u0161m\u0117")} turi klaiding\u0105 \u012Fvest\u012F`;
      }
      default:
        return "Klaidinga \u012Fvestis";
    }
  };
};
function Fp() {
  return { localeError: D_() };
}
var U_ = () => {
  let e = {
    string: {
      unit: "\u0437\u043D\u0430\u0446\u0438",
      verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
    },
    file: {
      unit: "\u0431\u0430\u0458\u0442\u0438",
      verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
    },
    array: {
      unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
      verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
    },
    set: {
      unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
      verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
    },
    map: {
      unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
      verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0432\u043D\u0435\u0441",
      email:
        "\u0430\u0434\u0440\u0435\u0441\u0430 \u043D\u0430 \u0435-\u043F\u043E\u0448\u0442\u0430",
      url: "URL",
      emoji: "\u0435\u043C\u043E\u045F\u0438",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u0434\u0430\u0442\u0443\u043C \u0438 \u0432\u0440\u0435\u043C\u0435",
      date: "ISO \u0434\u0430\u0442\u0443\u043C",
      time: "ISO \u0432\u0440\u0435\u043C\u0435",
      duration:
        "ISO \u0432\u0440\u0435\u043C\u0435\u0442\u0440\u0430\u0435\u045A\u0435",
      ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441\u0430",
      ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441\u0430",
      mac: "MAC \u0430\u0434\u0440\u0435\u0441\u0430",
      cidrv4: "IPv4 \u043E\u043F\u0441\u0435\u0433",
      cidrv6: "IPv6 \u043E\u043F\u0441\u0435\u0433",
      base64:
        "base64-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
      base64url:
        "base64url-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
      json_string: "JSON \u043D\u0438\u0437\u0430",
      e164: "E.164 \u0431\u0440\u043E\u0458",
      credit_card:
        "\u0431\u0440\u043E\u0458 \u043D\u0430 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u0447\u043A\u0430",
      currency_code:
        "\u043A\u043E\u0434 \u043D\u0430 \u0432\u0430\u043B\u0443\u0442\u0430",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0432\u043D\u0435\u0441",
    },
    o = {
      nan: "NaN",
      number: "\u0431\u0440\u043E\u0458",
      array: "\u043D\u0438\u0437\u0430",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 instanceof ${r.expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${s}`
          : `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${i}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Invalid input: expected ${y(r.values[0])}`
          : `\u0413\u0440\u0435\u0448\u0430\u043D\u0430 \u043E\u043F\u0446\u0438\u0458\u0430: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 \u0435\u0434\u043D\u0430 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0438\u043C\u0430 ${i}${r.maximum.toString()} ${a.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0438"}`
          : `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0431\u0438\u0434\u0435 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin} \u0434\u0430 \u0438\u043C\u0430 ${i}${r.minimum.toString()} ${a.unit}`
          : `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${r.origin} \u0434\u0430 \u0431\u0438\u0434\u0435 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u043D\u0443\u0432\u0430 \u0441\u043E "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u0432\u0440\u0448\u0443\u0432\u0430 \u0441\u043E "${i.suffix}"`
            : i.format === "includes"
              ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0432\u043A\u043B\u0443\u0447\u0443\u0432\u0430 "${i.includes}"`
              : i.format === "regex"
                ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u043E\u0434\u0433\u043E\u0430\u0440\u0430 \u043D\u0430 \u043F\u0430\u0442\u0435\u0440\u043D\u043E\u0442 ${i.pattern}`
                : `Invalid ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0413\u0440\u0435\u0448\u0435\u043D \u0431\u0440\u043E\u0458: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0431\u0438\u0434\u0435 \u0434\u0435\u043B\u0438\u0432 \u0441\u043E ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D\u0438 \u043A\u043B\u0443\u0447\u0435\u0432\u0438" : "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D \u043A\u043B\u0443\u0447"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0413\u0440\u0435\u0448\u0435\u043D \u043A\u043B\u0443\u0447 \u0432\u043E ${r.origin}`;
      case "invalid_union":
        return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
      case "invalid_element":
        return `\u0413\u0440\u0435\u0448\u043D\u0430 \u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442 \u0432\u043E ${r.origin}`;
      default:
        return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
    }
  };
};
function Mp() {
  return { localeError: U_() };
}
var E_ = () => {
  let e = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" },
    map: { unit: "elemen", verb: "mempunyai" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "input",
      email: "alamat e-mel",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "tarikh masa ISO",
      date: "tarikh ISO",
      time: "masa ISO",
      duration: "tempoh ISO",
      ipv4: "alamat IPv4",
      ipv6: "alamat IPv6",
      mac: "alamat MAC",
      cidrv4: "julat IPv4",
      cidrv6: "julat IPv6",
      base64: "string dikodkan base64",
      base64url: "string dikodkan base64url",
      json_string: "string JSON",
      e164: "nombor E.164",
      credit_card: "nombor kad kredit",
      currency_code: "kod mata wang",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = { nan: "NaN", number: "nombor" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Input tidak sah: dijangka instanceof ${r.expected}, diterima ${s}`
          : `Input tidak sah: dijangka ${i}, diterima ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Input tidak sah: dijangka ${y(r.values[0])}`
          : `Pilihan tidak sah: dijangka salah satu daripada ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Terlalu besar: dijangka ${r.origin ?? "nilai"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "elemen"}`
          : `Terlalu besar: dijangka ${r.origin ?? "nilai"} adalah ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Terlalu kecil: dijangka ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}`
          : `Terlalu kecil: dijangka ${r.origin} adalah ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `String tidak sah: mesti bermula dengan "${i.prefix}"`
          : i.format === "ends_with"
            ? `String tidak sah: mesti berakhir dengan "${i.suffix}"`
            : i.format === "includes"
              ? `String tidak sah: mesti mengandungi "${i.includes}"`
              : i.format === "regex"
                ? `String tidak sah: mesti sepadan dengan corak ${i.pattern}`
                : `${n[i.format] ?? r.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${r.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${r.origin}`;
      default:
        return "Input tidak sah";
    }
  };
};
function Jp() {
  return { localeError: E_() };
}
var Z_ = () => {
  let e = {
    string: {
      unit: "\u0905\u0915\u094D\u0937\u0930",
      verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
    },
    file: {
      unit: "\u092C\u093E\u0907\u091F",
      verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
    },
    array: {
      unit: "\u0924\u0924\u094D\u0935",
      verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
    },
    set: {
      unit: "\u0924\u0924\u094D\u0935",
      verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
    },
    map: {
      unit: "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F",
      verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0907\u0928\u092A\u0941\u091F",
      email: "\u0907\u092E\u0947\u0932 \u0920\u0947\u0917\u093E\u0928\u093E",
      url: "URL",
      emoji: "\u0907\u092E\u094B\u091C\u0940",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u092E\u093F\u0924\u093F \u0930 \u0938\u092E\u092F",
      date: "ISO \u092E\u093F\u0924\u093F",
      time: "ISO \u0938\u092E\u092F",
      duration: "ISO \u0905\u0935\u0927\u093F",
      ipv4: "IPv4 \u0920\u0947\u0917\u093E\u0928\u093E",
      ipv6: "IPv6 \u0920\u0947\u0917\u093E\u0928\u093E",
      mac: "MAC \u0920\u0947\u0917\u093E\u0928\u093E",
      cidrv4: "IPv4 \u0926\u093E\u092F\u0930\u093E",
      cidrv6: "IPv6 \u0926\u093E\u092F\u0930\u093E",
      base64:
        "base64-\u0907\u0928\u094D\u0915\u094B\u0921 \u0917\u0930\u093F\u090F\u0915\u094B \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
      base64url:
        "base64url-\u0907\u0928\u094D\u0915\u094B\u0921 \u0917\u0930\u093F\u090F\u0915\u094B \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
      json_string: "JSON \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
      e164: "E.164 \u0928\u092E\u094D\u092C\u0930",
      credit_card:
        "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0915\u093E\u0930\u094D\u0921 \u0928\u092E\u094D\u092C\u0930",
      currency_code: "\u092E\u0941\u0926\u094D\u0930\u093E \u0915\u094B\u0921",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0907\u0928\u092A\u0941\u091F",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${i}, \u092A\u094D\u0930\u093E\u092A\u094D\u0924 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${y(r.values[0])}`
          : `\u0905\u092E\u093E\u0928\u094D\u092F \u0935\u093F\u0915\u0932\u094D\u092A: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u092E\u093E\u0928\u0939\u0930\u0942 \u092E\u0927\u094D\u092F\u0947 \u090F\u0915 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0927\u0947\u0930\u0948 \u0920\u0942\u0932\u094B: ${r.origin ?? "\u092E\u093E\u0928"} \u092E\u093E ${i}${r.maximum.toString()} ${a.unit} ${a.verb}`
          : `\u0927\u0947\u0930\u0948 \u0920\u0942\u0932\u094B: ${r.origin ?? "\u092E\u093E\u0928"} ${i}${r.maximum.toString()} \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0927\u0947\u0930\u0948 \u0938\u093E\u0928\u094B: ${r.origin} \u092E\u093E ${i}${r.minimum.toString()} ${a.unit} ${a.verb}`
          : `\u0927\u0947\u0930\u0948 \u0938\u093E\u0928\u094B: ${r.origin} ${i}${r.minimum.toString()} \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "${i.prefix}" \u092C\u093E\u091F \u0938\u0941\u0930\u0941 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`
          : i.format === "ends_with"
            ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "${i.suffix}" \u092E\u093E \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`
            : i.format === "includes"
              ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "${i.includes}" \u0938\u092E\u093E\u0935\u0947\u0936 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`
              : i.format === "regex"
                ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: \u0922\u093E\u0901\u091A\u093E ${i.pattern} \u0938\u0901\u0917 \u092E\u0947\u0932 \u0916\u093E\u0928\u0941\u092A\u0930\u094D\u091B`
                : `\u0905\u092E\u093E\u0928\u094D\u092F ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E: ${r.divisor} \u0915\u094B \u0917\u0941\u0923\u091C \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`;
      case "unrecognized_keys":
        return `\u0905\u092A\u0930\u093F\u091A\u093F\u0924 \u0915\u0941\u091E\u094D\u091C\u0940${r.keys.length > 1 ? "\u0939\u0930\u0942" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u0915\u0941\u091E\u094D\u091C\u0940: ${r.origin} \u092E\u093E`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0
          ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0921\u093F\u0938\u094D\u0915\u094D\u0930\u093F\u092E\u093F\u0928\u0947\u091F\u0930 \u092E\u093E\u0928: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${r.options.map((a) => `'${a}'`).join(" | ")}`
          : "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
      case "invalid_element":
        return `\u0905\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0928: ${r.origin} \u092E\u093E`;
      default:
        return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
    }
  };
};
function Bp() {
  return { localeError: Z_() };
}
var C_ = () => {
  let e = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" },
    map: { unit: "elementen", verb: "heeft" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "invoer",
      email: "emailadres",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datum en tijd",
      date: "ISO datum",
      time: "ISO tijd",
      duration: "ISO duur",
      ipv4: "IPv4-adres",
      ipv6: "IPv6-adres",
      mac: "MAC-adres",
      cidrv4: "IPv4-bereik",
      cidrv6: "IPv6-bereik",
      base64: "base64-gecodeerde tekst",
      base64url: "base64 URL-gecodeerde tekst",
      json_string: "JSON string",
      e164: "E.164-nummer",
      credit_card: "creditcardnummer",
      currency_code: "valutacode",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "invoer",
    },
    o = { nan: "NaN", number: "getal" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Ongeldige invoer: verwacht instanceof ${r.expected}, ontving ${s}`
          : `Ongeldige invoer: verwacht ${i}, ontving ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Ongeldige invoer: verwacht ${y(r.values[0])}`
          : `Ongeldige optie: verwacht \xE9\xE9n van ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin),
          s =
            r.origin === "date"
              ? "laat"
              : r.origin === "string"
                ? "lang"
                : "groot";
        return a
          ? `Te ${s}: verwacht dat ${r.origin ?? "waarde"} ${i}${r.maximum.toString()} ${a.unit ?? "elementen"} ${a.verb}`
          : `Te ${s}: verwacht dat ${r.origin ?? "waarde"} ${i}${r.maximum.toString()} is`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin),
          s =
            r.origin === "date"
              ? "vroeg"
              : r.origin === "string"
                ? "kort"
                : "klein";
        return a
          ? `Te ${s}: verwacht dat ${r.origin} ${i}${r.minimum.toString()} ${a.unit} ${a.verb}`
          : `Te ${s}: verwacht dat ${r.origin} ${i}${r.minimum.toString()} is`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Ongeldige tekst: moet met "${i.prefix}" beginnen`
          : i.format === "ends_with"
            ? `Ongeldige tekst: moet op "${i.suffix}" eindigen`
            : i.format === "includes"
              ? `Ongeldige tekst: moet "${i.includes}" bevatten`
              : i.format === "regex"
                ? `Ongeldige tekst: moet overeenkomen met patroon ${i.pattern}`
                : `Ongeldig: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${r.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${r.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${r.origin}`;
      default:
        return "Ongeldige invoer";
    }
  };
};
function Kp() {
  return { localeError: C_() };
}
var L_ = () => {
  let e = {
    string: { unit: "teikn", verb: "\xE5 ha" },
    file: { unit: "bytes", verb: "\xE5 ha" },
    array: { unit: "element", verb: "\xE5 innehalde" },
    set: { unit: "element", verb: "\xE5 innehalde" },
    map: { unit: "element", verb: "\xE5 innehalde" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "input",
      email: "e-postadresse",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO dato- og klokkeslett",
      date: "ISO-dato",
      time: "ISO-klokkeslett",
      duration: "ISO-varigheit",
      ipv4: "IPv4-adresse",
      ipv6: "IPv6-adresse",
      mac: "MAC-adresse",
      cidrv4: "IPv4-spekter",
      cidrv6: "IPv6-spekter",
      base64: "base64-enkoda streng",
      base64url: "base64url-enkoda streng",
      json_string: "JSON-streng",
      e164: "E.164-nummer",
      credit_card: "kredittkortnummer",
      currency_code: "valutakode",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = { nan: "NaN", number: "tal", array: "liste" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Ugyldig input: forventa instanceof ${r.expected}, fekk ${s}`
          : `Ugyldig input: forventa ${i}, fekk ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Ugyldig verdi: forventa ${y(r.values[0])}`
          : `Ugyldig val: forventa eitt av ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `For stor(t): forventa ${r.origin ?? "value"} til \xE5 ha ${i}${r.maximum.toString()} ${a.unit ?? "element"}`
          : `For stor(t): forventa ${r.origin ?? "value"} til \xE5 ha ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `For lite(n): forventa ${r.origin} til \xE5 ha ${i}${r.minimum.toString()} ${a.unit}`
          : `For lite(n): forventa ${r.origin} til \xE5 ha ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Ugyldig streng: m\xE5 starte med "${i.prefix}"`
          : i.format === "ends_with"
            ? `Ugyldig streng: m\xE5 slutte med "${i.suffix}"`
            : i.format === "includes"
              ? `Ugyldig streng: m\xE5 innehalde "${i.includes}"`
              : i.format === "regex"
                ? `Ugyldig streng: m\xE5 matche m\xF8nsteret ${i.pattern}`
                : `Ugyldig ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tal: m\xE5 vere eit multiplum av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukjende n\xF8klar" : "Ukjend n\xF8kkel"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig n\xF8kkel i ${r.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${r.origin}`;
      default:
        return "Ugyldig input";
    }
  };
};
function Wp() {
  return { localeError: L_() };
}
var R_ = () => {
  let e = {
    string: { unit: "tegn", verb: "\xE5 ha" },
    file: { unit: "bytes", verb: "\xE5 ha" },
    array: { unit: "elementer", verb: "\xE5 inneholde" },
    set: { unit: "elementer", verb: "\xE5 inneholde" },
    map: { unit: "elementer", verb: "\xE5 inneholde" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "input",
      email: "e-postadresse",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO dato- og klokkeslett",
      date: "ISO-dato",
      time: "ISO-klokkeslett",
      duration: "ISO-varighet",
      ipv4: "IPv4-adresse",
      ipv6: "IPv6-adresse",
      mac: "MAC-adresse",
      cidrv4: "IPv4-spekter",
      cidrv6: "IPv6-spekter",
      base64: "base64-enkodet streng",
      base64url: "base64url-enkodet streng",
      json_string: "JSON-streng",
      e164: "E.164-nummer",
      credit_card: "kredittkortnummer",
      currency_code: "valutakode",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = { nan: "NaN", number: "tall", array: "liste" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Ugyldig input: forventet instanceof ${r.expected}, fikk ${s}`
          : `Ugyldig input: forventet ${i}, fikk ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Ugyldig verdi: forventet ${y(r.values[0])}`
          : `Ugyldig valg: forventet en av ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `For stor(t): forventet ${r.origin ?? "value"} til \xE5 ha ${i}${r.maximum.toString()} ${a.unit ?? "elementer"}`
          : `For stor(t): forventet ${r.origin ?? "value"} til \xE5 ha ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `For lite(n): forventet ${r.origin} til \xE5 ha ${i}${r.minimum.toString()} ${a.unit}`
          : `For lite(n): forventet ${r.origin} til \xE5 ha ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Ugyldig streng: m\xE5 starte med "${i.prefix}"`
          : i.format === "ends_with"
            ? `Ugyldig streng: m\xE5 ende med "${i.suffix}"`
            : i.format === "includes"
              ? `Ugyldig streng: m\xE5 inneholde "${i.includes}"`
              : i.format === "regex"
                ? `Ugyldig streng: m\xE5 matche m\xF8nsteret ${i.pattern}`
                : `Ugyldig ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: m\xE5 v\xE6re et multiplum av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukjente n\xF8kler" : "Ukjent n\xF8kkel"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig n\xF8kkel i ${r.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${r.origin}`;
      default:
        return "Ugyldig input";
    }
  };
};
function Gp() {
  return { localeError: R_() };
}
var V_ = () => {
  let e = {
    string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
    set: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
    map: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "giren",
      email: "epostag\xE2h",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO heng\xE2m\u0131",
      date: "ISO tarihi",
      time: "ISO zaman\u0131",
      duration: "ISO m\xFCddeti",
      ipv4: "IPv4 ni\u015F\xE2n\u0131",
      ipv6: "IPv6 ni\u015F\xE2n\u0131",
      mac: "MAC ni\u015F\xE2n\u0131",
      cidrv4: "IPv4 menzili",
      cidrv6: "IPv6 menzili",
      base64: "base64-\u015Fifreli metin",
      base64url: "base64url-\u015Fifreli metin",
      json_string: "JSON metin",
      e164: "E.164 say\u0131s\u0131",
      credit_card: "i'tib\xE2r kart\u0131 numaras\u0131",
      currency_code: "para birimi kodu",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "giren",
    },
    o = { nan: "NaN", number: "numara", array: "saf", null: "gayb" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `F\xE2sit giren: umulan instanceof ${r.expected}, al\u0131nan ${s}`
          : `F\xE2sit giren: umulan ${i}, al\u0131nan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `F\xE2sit giren: umulan ${y(r.values[0])}`
          : `F\xE2sit tercih: m\xFBteberler ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Fazla b\xFCy\xFCk: ${r.origin ?? "value"}, ${i}${r.maximum.toString()} ${a.unit ?? "elements"} sahip olmal\u0131yd\u0131.`
          : `Fazla b\xFCy\xFCk: ${r.origin ?? "value"}, ${i}${r.maximum.toString()} olmal\u0131yd\u0131.`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Fazla k\xFC\xE7\xFCk: ${r.origin}, ${i}${r.minimum.toString()} ${a.unit} sahip olmal\u0131yd\u0131.`
          : `Fazla k\xFC\xE7\xFCk: ${r.origin}, ${i}${r.minimum.toString()} olmal\u0131yd\u0131.`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `F\xE2sit metin: "${i.prefix}" ile ba\u015Flamal\u0131.`
          : i.format === "ends_with"
            ? `F\xE2sit metin: "${i.suffix}" ile bitmeli.`
            : i.format === "includes"
              ? `F\xE2sit metin: "${i.includes}" ihtiv\xE2 etmeli.`
              : i.format === "regex"
                ? `F\xE2sit metin: ${i.pattern} nak\u015F\u0131na uymal\u0131.`
                : `F\xE2sit ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `F\xE2sit say\u0131: ${r.divisor} kat\u0131 olmal\u0131yd\u0131.`;
      case "unrecognized_keys":
        return `Tan\u0131nmayan anahtar ${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} i\xE7in tan\u0131nmayan anahtar var.`;
      case "invalid_union":
        return "Giren tan\u0131namad\u0131.";
      case "invalid_element":
        return `${r.origin} i\xE7in tan\u0131nmayan k\u0131ymet var.`;
      default:
        return "K\u0131ymet tan\u0131namad\u0131.";
    }
  };
};
function qp() {
  return { localeError: V_() };
}
var F_ = () => {
  let e = {
    string: {
      unit: "\u062A\u0648\u06A9\u064A",
      verb: "\u0648\u0644\u0631\u064A",
    },
    file: {
      unit: "\u0628\u0627\u06CC\u067C\u0633",
      verb: "\u0648\u0644\u0631\u064A",
    },
    array: {
      unit: "\u062A\u0648\u06A9\u064A",
      verb: "\u0648\u0644\u0631\u064A",
    },
    set: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
    map: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0648\u0631\u0648\u062F\u064A",
      email: "\u0628\u0631\u06CC\u069A\u0646\u0627\u0644\u06CC\u06A9",
      url: "\u06CC\u0648 \u0622\u0631 \u0627\u0644",
      emoji: "\u0627\u06CC\u0645\u0648\u062C\u064A",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\u0646\u06CC\u067C\u0647 \u0627\u0648 \u0648\u062E\u062A",
      date: "\u0646\u06D0\u067C\u0647",
      time: "\u0648\u062E\u062A",
      duration: "\u0645\u0648\u062F\u0647",
      ipv4: "\u062F IPv4 \u067E\u062A\u0647",
      ipv6: "\u062F IPv6 \u067E\u062A\u0647",
      mac: "\u062F MAC \u067E\u062A\u0647",
      cidrv4: "\u062F IPv4 \u0633\u0627\u062D\u0647",
      cidrv6: "\u062F IPv6 \u0633\u0627\u062D\u0647",
      base64: "base64-encoded \u0645\u062A\u0646",
      base64url: "base64url-encoded \u0645\u062A\u0646",
      json_string: "JSON \u0645\u062A\u0646",
      e164: "\u062F E.164 \u0634\u0645\u06D0\u0631\u0647",
      credit_card:
        "\u062F \u06A9\u0631\u06CC\u0689\u06CC\u067C \u06A9\u0627\u0631\u062A \u0634\u0645\u06CC\u0631\u0647",
      currency_code:
        "\u062F \u0627\u0633\u0639\u0627\u0631\u0648 \u06A9\u0648\u0689",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0648\u0631\u0648\u062F\u064A",
    },
    o = {
      nan: "NaN",
      number: "\u0639\u062F\u062F",
      array: "\u0627\u0631\u06D0",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F instanceof ${r.expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${s} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`
          : `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${i} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${s} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${y(r.values[0])} \u0648\u0627\u06CC`
          : `\u0646\u0627\u0633\u0645 \u0627\u0646\u062A\u062E\u0627\u0628: \u0628\u0627\u06CC\u062F \u06CC\u0648 \u0644\u0647 ${g(r.values, "|")} \u0685\u062E\u0647 \u0648\u0627\u06CC`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${r.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0635\u0631\u0648\u0646\u0647"} \u0648\u0644\u0631\u064A`
          : `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${r.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${i}${r.maximum.toString()} \u0648\u064A`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} ${a.unit} \u0648\u0644\u0631\u064A`
          : `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${r.origin} \u0628\u0627\u06CC\u062F ${i}${r.minimum.toString()} \u0648\u064A`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${i.prefix}" \u0633\u0631\u0647 \u067E\u06CC\u0644 \u0634\u064A`
          : i.format === "ends_with"
            ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${i.suffix}" \u0633\u0631\u0647 \u067E\u0627\u06CC \u062A\u0647 \u0648\u0631\u0633\u064A\u0696\u064A`
            : i.format === "includes"
              ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F "${i.includes}" \u0648\u0644\u0631\u064A`
              : i.format === "regex"
                ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F ${i.pattern} \u0633\u0631\u0647 \u0645\u0637\u0627\u0628\u0642\u062A \u0648\u0644\u0631\u064A`
                : `${n[i.format] ?? r.format} \u0646\u0627\u0633\u0645 \u062F\u06CC`;
      }
      case "not_multiple_of":
        return `\u0646\u0627\u0633\u0645 \u0639\u062F\u062F: \u0628\u0627\u06CC\u062F \u062F ${r.divisor} \u0645\u0636\u0631\u0628 \u0648\u064A`;
      case "unrecognized_keys":
        return `\u0646\u0627\u0633\u0645 ${r.keys.length > 1 ? "\u06A9\u0644\u06CC\u0689\u0648\u0646\u0647" : "\u06A9\u0644\u06CC\u0689"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0646\u0627\u0633\u0645 \u06A9\u0644\u06CC\u0689 \u067E\u0647 ${r.origin} \u06A9\u06D0`;
      case "invalid_union":
        return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
      case "invalid_element":
        return `\u0646\u0627\u0633\u0645 \u0639\u0646\u0635\u0631 \u067E\u0647 ${r.origin} \u06A9\u06D0`;
      default:
        return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
    }
  };
};
function Xp() {
  return { localeError: F_() };
}
var M_ = () => {
  let e = {
    string: { unit: "znak\xF3w", verb: "mie\u0107" },
    file: { unit: "bajt\xF3w", verb: "mie\u0107" },
    array: { unit: "element\xF3w", verb: "mie\u0107" },
    set: { unit: "element\xF3w", verb: "mie\u0107" },
    map: { unit: "element\xF3w", verb: "mie\u0107" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "wyra\u017Cenie",
      email: "adres email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "data i godzina w formacie ISO",
      date: "data w formacie ISO",
      time: "godzina w formacie ISO",
      duration: "czas trwania ISO",
      ipv4: "adres IPv4",
      ipv6: "adres IPv6",
      mac: "adres MAC",
      cidrv4: "zakres IPv4",
      cidrv6: "zakres IPv6",
      base64: "ci\u0105g znak\xF3w zakodowany w formacie base64",
      base64url: "ci\u0105g znak\xF3w zakodowany w formacie base64url",
      json_string: "ci\u0105g znak\xF3w w formacie JSON",
      e164: "liczba E.164",
      credit_card: "numer karty kredytowej",
      currency_code: "kod waluty",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "wej\u015Bcie",
    },
    o = { nan: "NaN", number: "liczba", array: "tablica" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof ${r.expected}, otrzymano ${s}`
          : `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${i}, otrzymano ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${y(r.values[0])}`
          : `Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Za du\u017Ca warto\u015B\u0107: oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${i}${r.maximum.toString()} ${a.unit ?? "element\xF3w"}`
          : `Zbyt du\u017C(y/a/e): oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Za ma\u0142a warto\u015B\u0107: oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${i}${r.minimum.toString()} ${a.unit ?? "element\xF3w"}`
          : `Zbyt ma\u0142(y/a/e): oczekiwano, \u017Ce ${r.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zaczyna\u0107 si\u0119 od "${i.prefix}"`
          : i.format === "ends_with"
            ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi ko\u0144czy\u0107 si\u0119 na "${i.suffix}"`
            : i.format === "includes"
              ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zawiera\u0107 "${i.includes}"`
              : i.format === "regex"
                ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi odpowiada\u0107 wzorcowi ${i.pattern}`
                : `Nieprawid\u0142ow(y/a/e) ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nieprawid\u0142owa liczba: musi by\u0107 wielokrotno\u015Bci\u0105 ${r.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${r.keys.length > 1 ? "s" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawid\u0142owy klucz w ${r.origin}`;
      case "invalid_union":
        return "Nieprawid\u0142owe dane wej\u015Bciowe";
      case "invalid_element":
        return `Nieprawid\u0142owa warto\u015B\u0107 w ${r.origin}`;
      default:
        return "Nieprawid\u0142owe dane wej\u015Bciowe";
    }
  };
};
function Hp() {
  return { localeError: M_() };
}
var J_ = () => {
  let e = {
    string: { unit: "caracteres" },
    file: { unit: "bytes" },
    array: { unit: "elementos" },
    set: { unit: "elementos" },
    map: { unit: "entradas" },
  };
  function t(a) {
    return e[a] ?? null;
  }
  let n = {
      regex: "a entrada",
      email: "o endere\xE7o de e-mail",
      url: "o URL",
      emoji: "o emoji",
      uuid: "o UUID",
      uuidv4: "o UUIDv4",
      uuidv6: "o UUIDv6",
      nanoid: "o nanoid",
      guid: "o GUID",
      cuid: "o cuid",
      cuid2: "o cuid2",
      ulid: "o ULID",
      xid: "o XID",
      ksuid: "o KSUID",
      datetime: "a data e hora ISO",
      date: "a data ISO",
      time: "a hora ISO",
      duration: "a dura\xE7\xE3o ISO",
      ipv4: "o endere\xE7o IPv4",
      ipv6: "o endere\xE7o IPv6",
      mac: "o endere\xE7o MAC",
      cidrv4: "o intervalo de endere\xE7os IPv4",
      cidrv6: "o intervalo de endere\xE7os IPv6",
      base64: "o texto codificado em base64",
      base64url: "o texto codificado em base64url",
      json_string: "o texto JSON",
      e164: "o n\xFAmero E.164",
      credit_card: "o n\xFAmero de cart\xE3o de cr\xE9dito",
      currency_code: "o c\xF3digo de moeda",
      iban: "o IBAN",
      jwt: "o JWT",
      template_literal: "a entrada",
    },
    o = {
      masculine: { definite: "o", indefinite: "um" },
      feminine: { definite: "a", indefinite: "uma" },
    },
    r = {
      string: { name: "texto", articles: o.masculine },
      number: { name: "n\xFAmero", articles: o.masculine },
      int: { name: "n\xFAmero inteiro", articles: o.masculine },
      boolean: { name: "valor booleano", articles: o.masculine },
      bigint: { name: "n\xFAmero bigint", articles: o.masculine },
      symbol: { name: "s\xEDmbolo", articles: o.masculine },
      undefined: { name: 'valor "undefined"', articles: o.masculine },
      null: { name: 'valor "nulo"', articles: o.masculine },
      never: { name: 'valor "never"', articles: o.masculine },
      void: { name: 'valor "void"', articles: o.masculine },
      date: { name: "data", articles: o.feminine },
      array: { name: "vetor", articles: o.masculine },
      object: { name: "objeto", articles: o.masculine },
      tuple: { name: "tuplo", articles: o.masculine },
      record: { name: "registo", articles: o.masculine },
      map: { name: "mapa", articles: o.masculine },
      set: { name: "conjunto", articles: o.masculine },
      file: { name: "ficheiro", articles: o.masculine },
      nonoptional: { name: "valor n\xE3o opcional", articles: o.masculine },
      nan: { name: 'valor "NaN"', articles: o.masculine },
      function: { name: "fun\xE7\xE3o", articles: o.feminine },
    };
  function i(a, s) {
    let c = r[a] ?? { name: `valor "${a}"`, articles: o.masculine };
    return `${c.articles[s]} ${c.name}`;
  }
  return (a) => {
    switch (a.code) {
      case "invalid_type": {
        let s = i(a.expected, "indefinite"),
          c = $(a.input),
          u = i(c, "indefinite");
        return `Entrada inv\xE1lida: esperava ${s}, recebeu ${u}`;
      }
      case "invalid_value":
        return a.values.length === 1
          ? `Entrada inv\xE1lida: esperava ${y(a.values[0])}`
          : `Op\xE7\xE3o inv\xE1lida: esperava uma das seguintes op\xE7\xF5es: ${g(a.values, "|")}`;
      case "too_big": {
        let s = a.inclusive ? "<=" : "<",
          c = t(a.origin);
        return c
          ? `Demasiado grande: esperava que ${i(a.origin, "definite")} tivesse ${s} ${a.maximum.toString()} ${c.unit ?? "elementos"}`
          : `Demasiado grande: esperava que ${i(a.origin, "definite")} fosse ${s} ${a.maximum.toString()}`;
      }
      case "too_small": {
        let s = a.inclusive ? ">=" : ">",
          c = t(a.origin);
        return c
          ? `Demasiado pequeno: esperava que ${i(a.origin, "definite")} tivesse ${s} ${a.minimum.toString()} ${c.unit ?? "elementos"}`
          : `Demasiado pequeno: esperava que ${i(a.origin, "definite")} fosse ${s} ${a.minimum.toString()}`;
      }
      case "invalid_format": {
        let s = a;
        return s.format === "starts_with"
          ? `Texto inv\xE1lido: deve come\xE7ar por "${s.prefix}"`
          : s.format === "ends_with"
            ? `Texto inv\xE1lido: deve terminar em "${s.suffix}"`
            : s.format === "includes"
              ? `Texto inv\xE1lido: deve incluir "${s.includes}"`
              : s.format === "regex"
                ? `Texto inv\xE1lido: deve corresponder ao padr\xE3o ${s.pattern}`
                : `Formato d${n[s.format] ?? a.format} inv\xE1lido`;
      }
      case "not_multiple_of":
        return `N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ${a.divisor}`;
      case "unrecognized_keys": {
        let s = a.keys.length > 1 ? "s" : "";
        return `Chave${s} inv\xE1lida${s}: ${g(a.keys, ", ")}`;
      }
      case "invalid_key":
        return `Entrada inv\xE1lida n${i(a.origin, "definite")}`;
      case "invalid_union":
        return a.options && Array.isArray(a.options) && a.options.length > 0
          ? `Valor de discrimina\xE7\xE3o inv\xE1lido. Esperava ${a.options.map((c) => `'${c}'`).join(" | ")}`
          : "Entrada inv\xE1lida";
      case "invalid_element":
        return `Entrada inv\xE1lida n${i(a.origin, "definite")}`;
      default:
        return "Entrada inv\xE1lida";
    }
  };
};
function Yp() {
  return { localeError: J_() };
}
var B_ = () => {
  let e = {
    string: { unit: "caracteres" },
    file: { unit: "bytes" },
    array: { unit: "elementos" },
    set: { unit: "elementos" },
    map: { unit: "entradas" },
  };
  function t(a) {
    return e[a] ?? null;
  }
  let n = {
      regex: "a entrada",
      email: "o endere\xE7o de e-mail",
      url: "o URL",
      emoji: "o emoji",
      uuid: "o UUID",
      uuidv4: "o UUIDv4",
      uuidv6: "o UUIDv6",
      nanoid: "o nanoid",
      guid: "o GUID",
      cuid: "o cuid",
      cuid2: "o cuid2",
      ulid: "o ULID",
      xid: "o XID",
      ksuid: "o KSUID",
      datetime: "a data e hora ISO",
      date: "a data ISO",
      time: "a hora ISO",
      duration: "a dura\xE7\xE3o ISO",
      ipv4: "o endere\xE7o IPv4",
      ipv6: "o endere\xE7o IPv6",
      mac: "o endere\xE7o MAC",
      cidrv4: "a faixa de endere\xE7os IPv4",
      cidrv6: "a faixa de endere\xE7os IPv6",
      base64: "o texto codificado em base64",
      base64url: "o texto codificado em base64url",
      json_string: "o texto JSON",
      e164: "o n\xFAmero E.164",
      credit_card: "o n\xFAmero de cart\xE3o de cr\xE9dito",
      currency_code: "o c\xF3digo de moeda",
      iban: "o IBAN",
      jwt: "o JWT",
      template_literal: "a entrada",
    },
    o = {
      masculine: { definite: "o", indefinite: "um" },
      feminine: { definite: "a", indefinite: "uma" },
    },
    r = {
      string: { name: "texto", articles: o.masculine },
      number: { name: "n\xFAmero", articles: o.masculine },
      int: { name: "n\xFAmero inteiro", articles: o.masculine },
      boolean: { name: "valor booleano", articles: o.masculine },
      bigint: { name: "n\xFAmero bigint", articles: o.masculine },
      symbol: { name: "s\xEDmbolo", articles: o.masculine },
      undefined: { name: 'valor "undefined"', articles: o.masculine },
      null: { name: 'valor "nulo"', articles: o.masculine },
      never: { name: 'valor "never"', articles: o.masculine },
      void: { name: 'valor "void"', articles: o.masculine },
      date: { name: "data", articles: o.feminine },
      array: { name: "vetor", articles: o.masculine },
      object: { name: "objeto", articles: o.masculine },
      tuple: { name: "tupla", articles: o.feminine },
      record: { name: "registro", articles: o.masculine },
      map: { name: "mapa", articles: o.masculine },
      set: { name: "conjunto", articles: o.masculine },
      file: { name: "arquivo", articles: o.masculine },
      nonoptional: { name: "valor n\xE3o opcional", articles: o.masculine },
      nan: { name: 'valor "NaN"', articles: o.masculine },
      function: { name: "fun\xE7\xE3o", articles: o.feminine },
    };
  function i(a, s) {
    let c = r[a] ?? { name: `valor "${a}"`, articles: o.masculine };
    return `${c.articles[s]} ${c.name}`;
  }
  return (a) => {
    switch (a.code) {
      case "invalid_type": {
        let s = i(a.expected, "indefinite"),
          c = $(a.input),
          u = i(c, "indefinite");
        return `Entrada inv\xE1lida: esperava ${s}, recebeu ${u}`;
      }
      case "invalid_value":
        return a.values.length === 1
          ? `Entrada inv\xE1lida: esperava ${y(a.values[0])}`
          : `Op\xE7\xE3o inv\xE1lida: esperava uma das seguintes op\xE7\xF5es: ${g(a.values, "|")}`;
      case "too_big": {
        let s = a.inclusive ? "<=" : "<",
          c = t(a.origin);
        return c
          ? `Grande demais: esperava que ${i(a.origin, "definite")} tivesse ${s} ${a.maximum.toString()} ${c.unit ?? "elementos"}`
          : `Grande demais: esperava que ${i(a.origin, "definite")} fosse ${s} ${a.maximum.toString()}`;
      }
      case "too_small": {
        let s = a.inclusive ? ">=" : ">",
          c = t(a.origin);
        return c
          ? `Pequeno demais: esperava que ${i(a.origin, "definite")} tivesse ${s} ${a.minimum.toString()} ${c.unit ?? "elementos"}`
          : `Pequeno demais: esperava que ${i(a.origin, "definite")} fosse ${s} ${a.minimum.toString()}`;
      }
      case "invalid_format": {
        let s = a;
        return s.format === "starts_with"
          ? `Texto inv\xE1lido: deve come\xE7ar com "${s.prefix}"`
          : s.format === "ends_with"
            ? `Texto inv\xE1lido: deve terminar com "${s.suffix}"`
            : s.format === "includes"
              ? `Texto inv\xE1lido: deve incluir "${s.includes}"`
              : s.format === "regex"
                ? `Texto inv\xE1lido: deve corresponder ao padr\xE3o ${s.pattern}`
                : `Formato d${n[s.format] ?? a.format} inv\xE1lido`;
      }
      case "not_multiple_of":
        return `N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ${a.divisor}`;
      case "unrecognized_keys": {
        let s = a.keys.length > 1 ? "s" : "";
        return `Chave${s} inv\xE1lida${s}: ${g(a.keys, ", ")}`;
      }
      case "invalid_key":
        return `Entrada inv\xE1lida n${i(a.origin, "definite")}`;
      case "invalid_union":
        return a.options && Array.isArray(a.options) && a.options.length > 0
          ? `Valor de discrimina\xE7\xE3o inv\xE1lido. Esperava ${a.options.map((c) => `'${c}'`).join(" | ")}`
          : "Entrada inv\xE1lida";
      case "invalid_element":
        return `Entrada inv\xE1lida n${i(a.origin, "definite")}`;
      default:
        return "Entrada inv\xE1lida";
    }
  };
};
function Qp() {
  return { localeError: B_() };
}
var K_ = () => {
  let e = {
    string: { unit: "caractere", verb: "s\u0103 aib\u0103" },
    file: { unit: "octe\u021Bi", verb: "s\u0103 aib\u0103" },
    array: { unit: "elemente", verb: "s\u0103 aib\u0103" },
    set: { unit: "elemente", verb: "s\u0103 aib\u0103" },
    map: { unit: "intr\u0103ri", verb: "s\u0103 aib\u0103" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "intrare",
      email: "adres\u0103 de email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "dat\u0103 \u0219i or\u0103 ISO",
      date: "dat\u0103 ISO",
      time: "or\u0103 ISO",
      duration: "durat\u0103 ISO",
      ipv4: "adres\u0103 IPv4",
      ipv6: "adres\u0103 IPv6",
      mac: "adres\u0103 MAC",
      cidrv4: "interval IPv4",
      cidrv6: "interval IPv6",
      base64: "\u0219ir codat base64",
      base64url: "\u0219ir codat base64url",
      json_string: "\u0219ir JSON",
      e164: "num\u0103r E.164",
      credit_card: "num\u0103r de card de credit",
      currency_code: "cod valutar",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "intrare",
    },
    o = {
      nan: "NaN",
      string: "\u0219ir",
      number: "num\u0103r",
      boolean: "boolean",
      function: "func\u021Bie",
      array: "matrice",
      object: "obiect",
      undefined: "nedefinit",
      symbol: "simbol",
      bigint: "num\u0103r mare",
      void: "void",
      never: "never",
      map: "hart\u0103",
      set: "set",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `Intrare invalid\u0103: a\u0219teptat ${i}, primit ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Intrare invalid\u0103: a\u0219teptat ${y(r.values[0])}`
          : `Op\u021Biune invalid\u0103: a\u0219teptat una dintre ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Prea mare: a\u0219teptat ca ${r.origin ?? "valoarea"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "elemente"}`
          : `Prea mare: a\u0219teptat ca ${r.origin ?? "valoarea"} s\u0103 fie ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Prea mic: a\u0219teptat ca ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}`
          : `Prea mic: a\u0219teptat ca ${r.origin} s\u0103 fie ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0218ir invalid: trebuie s\u0103 \xEEnceap\u0103 cu "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u0218ir invalid: trebuie s\u0103 se termine cu "${i.suffix}"`
            : i.format === "includes"
              ? `\u0218ir invalid: trebuie s\u0103 includ\u0103 "${i.includes}"`
              : i.format === "regex"
                ? `\u0218ir invalid: trebuie s\u0103 se potriveasc\u0103 cu modelul ${i.pattern}`
                : `Format invalid: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Num\u0103r invalid: trebuie s\u0103 fie multiplu de ${r.divisor}`;
      case "unrecognized_keys":
        return `Chei nerecunoscute: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Cheie invalid\u0103 \xEEn ${r.origin}`;
      case "invalid_union":
        return "Intrare invalid\u0103";
      case "invalid_element":
        return `Valoare invalid\u0103 \xEEn ${r.origin}`;
      default:
        return "Intrare invalid\u0103";
    }
  };
};
function eg() {
  return { localeError: K_() };
}
function tg(e, t, n, o) {
  let r = Math.abs(e),
    i = r % 10,
    a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
var W_ = () => {
  let e = {
    string: {
      unit: {
        one: "\u0441\u0438\u043C\u0432\u043E\u043B",
        few: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
        many: "\u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
      },
      verb: "\u0438\u043C\u0435\u0442\u044C",
    },
    file: {
      unit: {
        one: "\u0431\u0430\u0439\u0442",
        few: "\u0431\u0430\u0439\u0442\u0430",
        many: "\u0431\u0430\u0439\u0442",
      },
      verb: "\u0438\u043C\u0435\u0442\u044C",
    },
    array: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
      },
      verb: "\u0438\u043C\u0435\u0442\u044C",
    },
    set: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
      },
      verb: "\u0438\u043C\u0435\u0442\u044C",
    },
    map: {
      unit: {
        one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
        few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
        many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
      },
      verb: "\u0438\u043C\u0435\u0442\u044C",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0432\u0432\u043E\u0434",
      email: "email \u0430\u0434\u0440\u0435\u0441",
      url: "URL",
      emoji: "\u044D\u043C\u043E\u0434\u0437\u0438",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F",
      date: "ISO \u0434\u0430\u0442\u0430",
      time: "ISO \u0432\u0440\u0435\u043C\u044F",
      duration:
        "ISO \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
      ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
      ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
      mac: "MAC \u0430\u0434\u0440\u0435\u0441",
      cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      base64:
        "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64",
      base64url:
        "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64url",
      json_string: "JSON \u0441\u0442\u0440\u043E\u043A\u0430",
      e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
      credit_card:
        "\u043D\u043E\u043C\u0435\u0440 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u044B",
      currency_code: "\u043A\u043E\u0434 \u0432\u0430\u043B\u044E\u0442\u044B",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0432\u0432\u043E\u0434",
    },
    o = {
      nan: "NaN",
      number: "\u0447\u0438\u0441\u043B\u043E",
      array: "\u043C\u0430\u0441\u0441\u0438\u0432",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C instanceof ${r.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${s}`
          : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${y(r.values[0])}`
          : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0434\u043D\u043E \u0438\u0437 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        if (a) {
          let s = Number(r.maximum),
            c = tg(s, a.unit.one, a.unit.few, a.unit.many);
          return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${i}${r.maximum.toString()} ${c}`;
        }
        return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        if (a) {
          let s = Number(r.minimum),
            c = tg(s, a.unit.one, a.unit.few, a.unit.many);
          return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${i}${r.minimum.toString()} ${c}`;
        }
        return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${r.origin} \u0431\u0443\u0434\u0435\u0442 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 "${i.suffix}"`
            : i.format === "includes"
              ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C "${i.includes}"`
              : i.format === "regex"
                ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}`
                : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E: \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D${r.keys.length > 1 ? "\u044B\u0435" : "\u044B\u0439"} \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u0438" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043B\u044E\u0447 \u0432 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
      case "invalid_element":
        return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 ${r.origin}`;
      default:
        return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
    }
  };
};
function rg() {
  return { localeError: W_() };
}
var G_ = () => {
  let e = {
    string: { unit: "znakov", verb: "ma\u0165" },
    file: { unit: "bajtov", verb: "ma\u0165" },
    array: { unit: "prvkov", verb: "ma\u0165" },
    set: { unit: "prvkov", verb: "ma\u0165" },
    map: { unit: "polo\u017Eiek", verb: "ma\u0165" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "regul\xE1rny v\xFDraz",
      email: "e-mailov\xE1 adresa",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "d\xE1tum a \u010Das vo form\xE1te ISO",
      date: "d\xE1tum vo form\xE1te ISO",
      time: "\u010Das vo form\xE1te ISO",
      duration: "doba trvania ISO",
      ipv4: "IPv4 adresa",
      ipv6: "IPv6 adresa",
      mac: "MAC adresa",
      cidrv4: "rozsah IPv4",
      cidrv6: "rozsah IPv6",
      base64: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64",
      base64url: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64url",
      json_string: "re\u0165azec vo form\xE1te JSON",
      e164: "\u010D\xEDslo E.164",
      credit_card: "\u010D\xEDslo kreditnej karty",
      currency_code: "k\xF3d meny",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "vstup",
    },
    o = {
      nan: "NaN",
      number: "\u010D\xEDslo",
      string: "re\u0165azec",
      function: "funkcia",
      array: "pole",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 instanceof ${r.expected}, obdr\u017Ean\xE9 ${s}`
          : `Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 ${i}, obdr\u017Ean\xE9 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 ${y(r.values[0])}`
          : `Neplatn\xFD vstup: o\u010Dak\xE1van\xE1 jedna z hodn\xF4t ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: ${r.origin ?? "hodnota"} mus\xED ma\u0165 ${i}${r.maximum.toString()} ${a.unit ?? "prvkov"}`
          : `Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: ${r.origin ?? "hodnota"} mus\xED by\u0165 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Hodnota je pr\xEDli\u0161 mal\xE1: ${r.origin ?? "hodnota"} mus\xED ma\u0165 ${i}${r.minimum.toString()} ${a.unit ?? "prvkov"}`
          : `Hodnota je pr\xEDli\u0161 mal\xE1: ${r.origin ?? "hodnota"} mus\xED by\u0165 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Neplatn\xFD re\u0165azec: mus\xED za\u010D\xEDna\u0165 na "${i.prefix}"`
          : i.format === "ends_with"
            ? `Neplatn\xFD re\u0165azec: mus\xED kon\u010Di\u0165 na "${i.suffix}"`
            : i.format === "includes"
              ? `Neplatn\xFD re\u0165azec: mus\xED obsahova\u0165 "${i.includes}"`
              : i.format === "regex"
                ? `Neplatn\xFD re\u0165azec: mus\xED zodpoveda\u0165 vzoru ${i.pattern}`
                : `Neplatn\xFD form\xE1t ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neplatn\xE9 \u010D\xEDslo: mus\xED by\u0165 n\xE1sobkom ${r.divisor}`;
      case "unrecognized_keys":
        return `Nezn\xE1me kl\xFA\u010De: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Neplatn\xFD kl\xFA\u010D v ${r.origin}`;
      case "invalid_union":
        return "Neplatn\xFD vstup";
      case "invalid_element":
        return `Neplatn\xE1 hodnota v ${r.origin}`;
      default:
        return "Neplatn\xFD vstup";
    }
  };
};
function ng() {
  return { localeError: G_() };
}
var q_ = () => {
  let e = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" },
    map: { unit: "elementov", verb: "imeti" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "vnos",
      email: "e-po\u0161tni naslov",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datum in \u010Das",
      date: "ISO datum",
      time: "ISO \u010Das",
      duration: "ISO trajanje",
      ipv4: "IPv4 naslov",
      ipv6: "IPv6 naslov",
      mac: "MAC naslov",
      cidrv4: "obseg IPv4",
      cidrv6: "obseg IPv6",
      base64: "base64 kodiran niz",
      base64url: "base64url kodiran niz",
      json_string: "JSON niz",
      e164: "E.164 \u0161tevilka",
      credit_card: "\u0161tevilka kreditne kartice",
      currency_code: "koda valute",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "vnos",
    },
    o = { nan: "NaN", number: "\u0161tevilo", array: "tabela" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Neveljaven vnos: pri\u010Dakovano instanceof ${r.expected}, prejeto ${s}`
          : `Neveljaven vnos: pri\u010Dakovano ${i}, prejeto ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Neveljaven vnos: pri\u010Dakovano ${y(r.values[0])}`
          : `Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Preveliko: pri\u010Dakovano, da bo ${r.origin ?? "vrednost"} imelo ${i}${r.maximum.toString()} ${a.unit ?? "elementov"}`
          : `Preveliko: pri\u010Dakovano, da bo ${r.origin ?? "vrednost"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Premajhno: pri\u010Dakovano, da bo ${r.origin} imelo ${i}${r.minimum.toString()} ${a.unit}`
          : `Premajhno: pri\u010Dakovano, da bo ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Neveljaven niz: mora se za\u010Deti z "${i.prefix}"`
          : i.format === "ends_with"
            ? `Neveljaven niz: mora se kon\u010Dati z "${i.suffix}"`
            : i.format === "includes"
              ? `Neveljaven niz: mora vsebovati "${i.includes}"`
              : i.format === "regex"
                ? `Neveljaven niz: mora ustrezati vzorcu ${i.pattern}`
                : `Neveljaven ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno \u0161tevilo: mora biti ve\u010Dkratnik ${r.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${r.keys.length > 1 ? "i klju\u010Di" : " klju\u010D"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven klju\u010D v ${r.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${r.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
};
function ig() {
  return { localeError: q_() };
}
var X_ = () => {
  let e = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att inneh\xE5lla" },
    set: { unit: "objekt", verb: "att inneh\xE5lla" },
    map: { unit: "objekt", verb: "att inneh\xE5lla" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "regulj\xE4rt uttryck",
      email: "e-postadress",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-datum och tid",
      date: "ISO-datum",
      time: "ISO-tid",
      duration: "ISO-varaktighet",
      ipv4: "IPv4-adress",
      ipv6: "IPv6-adress",
      mac: "MAC-adress",
      cidrv4: "IPv4-spektrum",
      cidrv6: "IPv6-spektrum",
      base64: "base64-kodad str\xE4ng",
      base64url: "base64url-kodad str\xE4ng",
      json_string: "JSON-str\xE4ng",
      e164: "E.164-nummer",
      credit_card: "kreditkortsnummer",
      currency_code: "valutakod",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "mall-literal",
    },
    o = { nan: "NaN", number: "antal", array: "lista" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Ogiltig inmatning: f\xF6rv\xE4ntat instanceof ${r.expected}, fick ${s}`
          : `Ogiltig inmatning: f\xF6rv\xE4ntat ${i}, fick ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Ogiltig inmatning: f\xF6rv\xE4ntat ${y(r.values[0])}`
          : `Ogiltigt val: f\xF6rv\xE4ntade en av ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `F\xF6r stor(t): f\xF6rv\xE4ntade ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.maximum.toString()} ${a.unit ?? "element"}`
          : `F\xF6r stor(t): f\xF6rv\xE4ntat ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `F\xF6r lite(t): f\xF6rv\xE4ntade ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.minimum.toString()} ${a.unit}`
          : `F\xF6r lite(t): f\xF6rv\xE4ntade ${r.origin ?? "v\xE4rdet"} att ha ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Ogiltig str\xE4ng: m\xE5ste b\xF6rja med "${i.prefix}"`
          : i.format === "ends_with"
            ? `Ogiltig str\xE4ng: m\xE5ste sluta med "${i.suffix}"`
            : i.format === "includes"
              ? `Ogiltig str\xE4ng: m\xE5ste inneh\xE5lla "${i.includes}"`
              : i.format === "regex"
                ? `Ogiltig str\xE4ng: m\xE5ste matcha m\xF6nstret "${i.pattern}"`
                : `Ogiltig(t) ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: m\xE5ste vara en multipel av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ok\xE4nda nycklar" : "Ok\xE4nd nyckel"}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${r.origin ?? "v\xE4rdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt v\xE4rde i ${r.origin ?? "v\xE4rdet"}`;
      default:
        return "Ogiltig input";
    }
  };
};
function og() {
  return { localeError: X_() };
}
var H_ = () => {
  let e = {
    string: {
      unit: "\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
      verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
    },
    file: {
      unit: "\u0BAA\u0BC8\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",
      verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
    },
    array: {
      unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
      verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
    },
    set: {
      unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
      verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
    },
    map: {
      unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
      verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1",
      email:
        "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0BA4\u0BC7\u0BA4\u0BBF \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
      date: "ISO \u0BA4\u0BC7\u0BA4\u0BBF",
      time: "ISO \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
      duration: "ISO \u0B95\u0BBE\u0BB2 \u0B85\u0BB3\u0BB5\u0BC1",
      ipv4: "IPv4 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
      ipv6: "IPv6 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
      mac: "MAC \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
      cidrv4: "IPv4 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
      cidrv6: "IPv6 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
      base64: "base64-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
      base64url: "base64url-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
      json_string: "JSON \u0B9A\u0BB0\u0BAE\u0BCD",
      e164: "E.164 \u0B8E\u0BA3\u0BCD",
      credit_card:
        "\u0B95\u0B9F\u0BA9\u0BCD \u0B85\u0B9F\u0BCD\u0B9F\u0BC8 \u0B8E\u0BA3\u0BCD",
      currency_code:
        "\u0BA8\u0BBE\u0BA3\u0BAF\u0B95\u0BCD \u0B95\u0BC1\u0BB1\u0BBF\u0BAF\u0BC0\u0B9F\u0BC1",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input",
    },
    o = {
      nan: "NaN",
      number: "\u0B8E\u0BA3\u0BCD",
      array: "\u0B85\u0BA3\u0BBF",
      null: "\u0BB5\u0BC6\u0BB1\u0BC1\u0BAE\u0BC8",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 instanceof ${r.expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${s}`
          : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${i}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${y(r.values[0])}`
          : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${g(r.values, "|")} \u0B87\u0BB2\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${i}${r.maximum.toString()} ${a.unit ?? "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD"} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
          : `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${i}${r.maximum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin} ${i}${r.minimum.toString()} ${a.unit} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
          : `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${r.origin} ${i}${r.minimum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.prefix}" \u0B87\u0BB2\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
          : i.format === "ends_with"
            ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.suffix}" \u0B87\u0BB2\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0B9F\u0BC8\u0BAF \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
            : i.format === "includes"
              ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.includes}" \u0B90 \u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
              : i.format === "regex"
                ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: ${i.pattern} \u0BAE\u0BC1\u0BB1\u0BC8\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1\u0B9F\u0BA9\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
                : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B8E\u0BA3\u0BCD: ${r.divisor} \u0B87\u0BA9\u0BCD \u0BAA\u0BB2\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
      case "unrecognized_keys":
        return `\u0B85\u0B9F\u0BC8\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BA4 \u0BB5\u0BBF\u0B9A\u0BC8${r.keys.length > 1 ? "\u0B95\u0BB3\u0BCD" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0B9A\u0BC8`;
      case "invalid_union":
        return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
      case "invalid_element":
        return `${r.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1`;
      default:
        return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
    }
  };
};
function ag() {
  return { localeError: H_() };
}
var Y_ = () => {
  let e = {
    string: {
      unit: "\u0430\u043B\u043E\u043C\u0430\u0442",
      verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
    },
    file: {
      unit: "\u0431\u0430\u0439\u0442",
      verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
    },
    array: {
      unit: "\u0443\u043D\u0441\u0443\u0440",
      verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
    },
    set: {
      unit: "\u0443\u043D\u0441\u0443\u0440",
      verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
    },
    map: {
      unit: "\u0441\u0430\u0431\u0442",
      verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0432\u0443\u0440\u0443\u0434",
      email: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 email",
      url: "URL",
      emoji: "\u044D\u043C\u043E\u04B7\u0438",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u0441\u0430\u043D\u0430\u0432\u0443 \u0432\u0430\u049B\u0442\u0438 ISO",
      date: "\u0441\u0430\u043D\u0430\u0438 ISO",
      time: "\u0432\u0430\u049B\u0442\u0438 ISO",
      duration:
        "\u0434\u0430\u0432\u043E\u043C\u043D\u043E\u043A\u0438\u0438 ISO",
      ipv4: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 IPv4",
      ipv6: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 IPv6",
      mac: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 MAC",
      cidrv4: "\u043C\u0430\u04B3\u0434\u0443\u0434\u0430\u0438 IPv4",
      cidrv6: "\u043C\u0430\u04B3\u0434\u0443\u0434\u0430\u0438 IPv6",
      base64:
        "\u0441\u0430\u0442\u0440\u0438 \u0434\u0430\u0440 \u0444\u043E\u0440\u043C\u0430\u0442\u0438 base64",
      base64url:
        "\u0441\u0430\u0442\u0440\u0438 \u0434\u0430\u0440 \u0444\u043E\u0440\u043C\u0430\u0442\u0438 base64url",
      json_string: "\u0441\u0430\u0442\u0440\u0438 JSON",
      e164: "\u0440\u0430\u049B\u0430\u043C\u0438 E.164",
      credit_card:
        "\u0440\u0430\u049B\u0430\u043C\u0438 \u043A\u043E\u0440\u0442\u0438 \u043A\u0440\u0435\u0434\u0438\u0442\u04E3",
      currency_code:
        "\u0440\u0430\u043C\u0437\u0438 \u0430\u0441\u044A\u043E\u0440",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0432\u0443\u0440\u0443\u0434",
    },
    o = {
      nan: "NaN",
      number: "\u0440\u0430\u049B\u0430\u043C",
      string: "\u0441\u0430\u0442\u0440",
      array: "\u043C\u0430\u0441\u0441\u0438\u0432",
      object: "\u043E\u0431\u044A\u0435\u043A\u0442",
      date: "\u0441\u0430\u043D\u0430",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: ${i} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442, ${s} \u0433\u0438\u0440\u0438\u0444\u0442\u0430 \u0448\u0443\u0434`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: ${y(r.values[0])} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442`
          : `\u0418\u043D\u0442\u0438\u0445\u043E\u0431\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u044F\u043A\u0435 \u0430\u0437 ${g(r.values, "|")} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0425\u0435\u043B\u0435 \u043A\u0430\u043B\u043E\u043D: ${r.origin ?? "\u049B\u0438\u043C\u0430\u0442"} \u0431\u043E\u044F\u0434 ${i}${r.maximum.toString()} ${a.unit} ${a.verb}`
          : `\u0425\u0435\u043B\u0435 \u043A\u0430\u043B\u043E\u043D: ${r.origin ?? "\u049B\u0438\u043C\u0430\u0442"} \u0431\u043E\u044F\u0434 ${i}${r.maximum.toString()} \u0431\u043E\u0448\u0430\u0434`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0425\u0435\u043B\u0435 \u0445\u0443\u0440\u0434: ${r.origin} \u0431\u043E\u044F\u0434 ${i}${r.minimum.toString()} ${a.unit} ${a.verb}`
          : `\u0425\u0435\u043B\u0435 \u0445\u0443\u0440\u0434: ${r.origin} \u0431\u043E\u044F\u0434 ${i}${r.minimum.toString()} \u0431\u043E\u0448\u0430\u0434`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u043E "${i.prefix}" \u043E\u0493\u043E\u0437 \u0448\u0430\u0432\u0430\u0434`
          : i.format === "ends_with"
            ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u043E "${i.suffix}" \u0430\u043D\u04B7\u043E\u043C \u0451\u0431\u0430\u0434`
            : i.format === "includes"
              ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 "${i.includes}"-\u0440\u043E \u0434\u0430\u0440 \u0431\u0430\u0440 \u0433\u0438\u0440\u0430\u0434`
              : i.format === "regex"
                ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u0430 \u043D\u0430\u043C\u0443\u043D\u0430\u0438 ${i.pattern} \u043C\u0443\u0432\u043E\u0444\u0438\u049B\u0430\u0442 \u043A\u0443\u043D\u0430\u0434`
                : `${n[i.format] ?? r.format}-\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442`;
      }
      case "not_multiple_of":
        return `\u0420\u0430\u049B\u0430\u043C\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u0430 ${r.divisor} \u0431\u0435 \u0431\u0430\u049B\u0438\u044F \u0442\u0430\u049B\u0441\u0438\u043C \u0448\u0430\u0432\u0430\u0434`;
      case "unrecognized_keys":
        return `\u041A\u0430\u043B\u0438\u0434${r.keys.length > 1 ? "\u04B3\u043E\u0438" : "\u0438"} \u043D\u043E\u043C\u0430\u044A\u043B\u0443\u043C: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041A\u0430\u043B\u0438\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442 \u0434\u0430\u0440 ${r.origin}`;
      case "invalid_union":
        return r.options && Array.isArray(r.options) && r.options.length > 0
          ? `\u049A\u0438\u043C\u0430\u0442\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442\u0438 \u0434\u0438\u0441\u043A\u0440\u0438\u043C\u0438\u043D\u0430\u0442\u043E\u0440: ${r.options.map((a) => `'${a}'`).join(" | ")} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442`
          : "\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442";
      case "invalid_element":
        return `\u049A\u0438\u043C\u0430\u0442\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442 \u0434\u0430\u0440 ${r.origin}`;
      default:
        return "\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442";
    }
  };
};
function sg() {
  return { localeError: Y_() };
}
var Q_ = () => {
  let e = {
    string: {
      unit: "\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23",
      verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
    },
    file: {
      unit: "\u0E44\u0E1A\u0E15\u0E4C",
      verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
    },
    array: {
      unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
      verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
    },
    set: {
      unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
      verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
    },
    map: {
      unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
      verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex:
        "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
      email:
        "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E2D\u0E35\u0E40\u0E21\u0E25",
      url: "URL",
      emoji: "\u0E2D\u0E34\u0E42\u0E21\u0E08\u0E34",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
      date: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E1A\u0E1A ISO",
      time: "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
      duration:
        "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
      ipv4: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv4",
      ipv6: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv6",
      mac: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 MAC",
      cidrv4: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv4",
      cidrv6: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv6",
      base64:
        "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64",
      base64url:
        "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A URL",
      json_string:
        "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A JSON",
      e164: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28 (E.164)",
      credit_card:
        "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15",
      currency_code:
        "\u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E01\u0E38\u0E25\u0E40\u0E07\u0E34\u0E19",
      iban: "IBAN",
      jwt: "\u0E42\u0E17\u0E40\u0E04\u0E19 JWT",
      template_literal:
        "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
    },
    o = {
      nan: "NaN",
      number: "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02",
      array: "\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C (Array)",
      null: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32 (null)",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 instanceof ${r.expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${s}`
          : `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${i} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${y(r.values[0])}`
          : `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive
            ? "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19"
            : "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32",
          a = t(r.origin);
        return a
          ? `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.maximum.toString()} ${a.unit ?? "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"}`
          : `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive
            ? "\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22"
            : "\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32",
          a = t(r.origin);
        return a
          ? `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.minimum.toString()} ${a.unit}`
          : `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${r.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E25\u0E07\u0E17\u0E49\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22 "${i.suffix}"`
            : i.format === "includes"
              ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 "${i.includes}" \u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21`
              : i.format === "regex"
                ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ${i.pattern}`
                : `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22 ${r.divisor} \u0E44\u0E14\u0E49\u0E25\u0E07\u0E15\u0E31\u0E27`;
      case "unrecognized_keys":
        return `\u0E1E\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u0E04\u0E35\u0E22\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${r.origin}`;
      case "invalid_union":
        return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E22\u0E39\u0E40\u0E19\u0E35\u0E22\u0E19\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
      case "invalid_element":
        return `\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${r.origin}`;
      default:
        return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07";
    }
  };
};
function ug() {
  return { localeError: Q_() };
}
var eb = () => {
  let e = {
    string: { unit: "simwol", verb: "bolmaly" },
    file: { unit: "ba\xFDt", verb: "bolmaly" },
    array: { unit: "elementler", verb: "bolmaly" },
    set: { unit: "elementler", verb: "bolmaly" },
    map: { unit: "elementler", verb: "bolmaly" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "giri\u015F",
      email: "e-po\xE7ta salgysy",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO sene we wagt",
      date: "ISO sene",
      time: "ISO wagt",
      duration: "ISO wagt aralygy",
      ipv4: "IPv4 salgysy",
      ipv6: "IPv6 salgysy",
      mac: "MAC salgysy",
      cidrv4: "IPv4 aralygy",
      cidrv6: "IPv6 aralygy",
      base64: "base64 bilen \u015Fifrlenen setir",
      base64url: "base64url bilen \u015Fifrlenen setir",
      json_string: "JSON setiri",
      e164: "E.164 nomeri",
      credit_card: "kredit kartyny\u0148 nomeri",
      currency_code: "wal\xFDuta kody",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u015Fablon",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return `N\xE4dogry baha: gara\u015Fylan ${i} \xFDerine ${s} alyndy`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `N\xE4dogry baha: ${y(r.values[0])} bolmaly`
          : `N\xE4dogry sa\xFDlaw: a\u015Fakdakylardan biri bolmaly: ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Has uly: gara\u015Fyl\xFDan ${r.origin ?? "baha"} ${i} ${r.maximum.toString()} ${a.unit ?? "element"}`
          : `Has uly: gara\u015Fyl\xFDan ${r.origin ?? "baha"} ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Has ki\xE7i: gara\u015Fyl\xFDan ${r.origin} ${i} ${r.minimum.toString()} ${a.unit}`
          : `Has ki\xE7i: gara\u015Fyl\xFDan ${r.origin} ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `N\xE4dogry setir: "${i.prefix}" bilen ba\u015Flamaly`
          : i.format === "ends_with"
            ? `N\xE4dogry setir: "${i.suffix}" bilen gutarmaly`
            : i.format === "includes"
              ? `N\xE4dogry setir: "${i.includes}" saklamaly`
              : i.format === "regex"
                ? `N\xE4dogry setir: ${i.pattern} nusga la\xFDyk bolmaly`
                : `N\xE4dogry ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `N\xE4dogry san: ${r.divisor} bilen galyndysyz b\xF6l\xFCnmeli`;
      case "unrecognized_keys":
        return `Tanalma\xFDan a\xE7ar${r.keys.length > 1 ? "lar" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} i\xE7inde n\xE4dogry a\xE7ar`;
      case "invalid_union":
        return "N\xE4dogry baha";
      case "invalid_element":
        return `${r.origin} i\xE7inde n\xE4dogry baha`;
      default:
        return "N\xE4dogry baha";
    }
  };
};
function cg() {
  return { localeError: eb() };
}
var tb = () => {
  let e = {
    string: { unit: "karakter", verb: "olmal\u0131" },
    file: { unit: "bayt", verb: "olmal\u0131" },
    array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
    set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
    map: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "girdi",
      email: "e-posta adresi",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO tarih ve saat",
      date: "ISO tarih",
      time: "ISO saat",
      duration: "ISO s\xFCre",
      ipv4: "IPv4 adresi",
      ipv6: "IPv6 adresi",
      mac: "MAC adresi",
      cidrv4: "IPv4 aral\u0131\u011F\u0131",
      cidrv6: "IPv6 aral\u0131\u011F\u0131",
      base64: "base64 ile \u015Fifrelenmi\u015F metin",
      base64url: "base64url ile \u015Fifrelenmi\u015F metin",
      json_string: "JSON dizesi",
      e164: "E.164 say\u0131s\u0131",
      credit_card: "kredi kart\u0131 numaras\u0131",
      currency_code: "para birimi kodu",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u015Eablon dizesi",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Ge\xE7ersiz de\u011Fer: beklenen instanceof ${r.expected}, al\u0131nan ${s}`
          : `Ge\xE7ersiz de\u011Fer: beklenen ${i}, al\u0131nan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Ge\xE7ersiz de\u011Fer: beklenen ${y(r.values[0])}`
          : `Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\xC7ok b\xFCy\xFCk: beklenen ${r.origin ?? "de\u011Fer"} ${i}${r.maximum.toString()} ${a.unit ?? "\xF6\u011Fe"}`
          : `\xC7ok b\xFCy\xFCk: beklenen ${r.origin ?? "de\u011Fer"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\xC7ok k\xFC\xE7\xFCk: beklenen ${r.origin} ${i}${r.minimum.toString()} ${a.unit}`
          : `\xC7ok k\xFC\xE7\xFCk: beklenen ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Ge\xE7ersiz metin: "${i.prefix}" ile ba\u015Flamal\u0131`
          : i.format === "ends_with"
            ? `Ge\xE7ersiz metin: "${i.suffix}" ile bitmeli`
            : i.format === "includes"
              ? `Ge\xE7ersiz metin: "${i.includes}" i\xE7ermeli`
              : i.format === "regex"
                ? `Ge\xE7ersiz metin: ${i.pattern} desenine uymal\u0131`
                : `Ge\xE7ersiz ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ge\xE7ersiz say\u0131: ${r.divisor} ile tam b\xF6l\xFCnebilmeli`;
      case "unrecognized_keys":
        return `Tan\u0131nmayan anahtar${r.keys.length > 1 ? "lar" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} i\xE7inde ge\xE7ersiz anahtar`;
      case "invalid_union":
        return "Ge\xE7ersiz de\u011Fer";
      case "invalid_element":
        return `${r.origin} i\xE7inde ge\xE7ersiz de\u011Fer`;
      default:
        return "Ge\xE7ersiz de\u011Fer";
    }
  };
};
function lg() {
  return { localeError: tb() };
}
var rb = () => {
  let e = {
    string: {
      unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432",
      verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
    },
    file: {
      unit: "\u0431\u0430\u0439\u0442\u0456\u0432",
      verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
    },
    array: {
      unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
      verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
    },
    set: {
      unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
      verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
    },
    map: {
      unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
      verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
      email:
        "\u0430\u0434\u0440\u0435\u0441\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0457 \u043F\u043E\u0448\u0442\u0438",
      url: "URL",
      emoji: "\u0435\u043C\u043E\u0434\u0437\u0456",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\u0434\u0430\u0442\u0430 \u0442\u0430 \u0447\u0430\u0441 ISO",
      date: "\u0434\u0430\u0442\u0430 ISO",
      time: "\u0447\u0430\u0441 ISO",
      duration:
        "\u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C ISO",
      ipv4: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv4",
      ipv6: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv6",
      mac: "\u0430\u0434\u0440\u0435\u0441\u0430 MAC",
      cidrv4: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv4",
      cidrv6: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv6",
      base64:
        "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64",
      base64url:
        "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64url",
      json_string: "\u0440\u044F\u0434\u043E\u043A JSON",
      e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
      credit_card:
        "\u043D\u043E\u043C\u0435\u0440 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u043E\u0457 \u043A\u0430\u0440\u0442\u043A\u0438",
      currency_code: "\u043A\u043E\u0434 \u0432\u0430\u043B\u044E\u0442\u0438",
      iban: "IBAN",
      jwt: "JWT",
      template_literal:
        "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
    },
    o = {
      nan: "NaN",
      number: "\u0447\u0438\u0441\u043B\u043E",
      array: "\u043C\u0430\u0441\u0438\u0432",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F instanceof ${r.expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${s}`
          : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${i}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${y(r.values[0])}`
          : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430 \u043E\u043F\u0446\u0456\u044F: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u043D\u0435 \u0437 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432"}`
          : `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} \u0431\u0443\u0434\u0435 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}`
          : `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${r.origin} \u0431\u0443\u0434\u0435 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0437 "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0437\u0430\u043A\u0456\u043D\u0447\u0443\u0432\u0430\u0442\u0438\u0441\u044F \u043D\u0430 "${i.suffix}"`
            : i.format === "includes"
              ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043C\u0456\u0441\u0442\u0438\u0442\u0438 "${i.includes}"`
              : i.format === "regex"
                ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}`
                : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0447\u0438\u0441\u043B\u043E: \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u0431\u0443\u0442\u0438 \u043A\u0440\u0430\u0442\u043D\u0438\u043C ${r.divisor}`;
      case "unrecognized_keys":
        return `\u041D\u0435\u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0438\u0439 \u043A\u043B\u044E\u0447${r.keys.length > 1 ? "\u0456" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 \u0443 ${r.origin}`;
      case "invalid_union":
        return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
      case "invalid_element":
        return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0443 ${r.origin}`;
      default:
        return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
    }
  };
};
function oo() {
  return { localeError: rb() };
}
function dg() {
  return oo();
}
var nb = () => {
  let e = {
    string: {
      unit: "\u062D\u0631\u0648\u0641",
      verb: "\u06C1\u0648\u0646\u0627",
    },
    file: {
      unit: "\u0628\u0627\u0626\u0679\u0633",
      verb: "\u06C1\u0648\u0646\u0627",
    },
    array: {
      unit: "\u0622\u0626\u0679\u0645\u0632",
      verb: "\u06C1\u0648\u0646\u0627",
    },
    set: {
      unit: "\u0622\u0626\u0679\u0645\u0632",
      verb: "\u06C1\u0648\u0646\u0627",
    },
    map: {
      unit: "\u0622\u0626\u0679\u0645\u0632",
      verb: "\u06C1\u0648\u0646\u0627",
    },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0627\u0646 \u067E\u0679",
      email:
        "\u0627\u06CC \u0645\u06CC\u0644 \u0627\u06CC\u0688\u0631\u06CC\u0633",
      url: "\u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644",
      emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
      uuid: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      uuidv4:
        "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 4",
      uuidv6:
        "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 6",
      nanoid: "\u0646\u06CC\u0646\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      guid: "\u062C\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      cuid: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      cuid2: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC 2",
      ulid: "\u06CC\u0648 \u0627\u06CC\u0644 \u0622\u0626\u06CC \u0688\u06CC",
      xid: "\u0627\u06CC\u06A9\u0633 \u0622\u0626\u06CC \u0688\u06CC",
      ksuid:
        "\u06A9\u06D2 \u0627\u06CC\u0633 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      datetime:
        "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0688\u06CC\u0679 \u0679\u0627\u0626\u0645",
      date: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u062A\u0627\u0631\u06CC\u062E",
      time: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0648\u0642\u062A",
      duration:
        "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0645\u062F\u062A",
      ipv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0627\u06CC\u0688\u0631\u06CC\u0633",
      ipv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0627\u06CC\u0688\u0631\u06CC\u0633",
      mac: "\u0627\u06CC\u0645 \u0627\u06D2 \u0633\u06CC \u0627\u06CC\u0688\u0631\u06CC\u0633",
      cidrv4:
        "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0631\u06CC\u0646\u062C",
      cidrv6:
        "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0631\u06CC\u0646\u062C",
      base64:
        "\u0628\u06CC\u0633 64 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
      base64url:
        "\u0628\u06CC\u0633 64 \u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
      json_string:
        "\u062C\u06D2 \u0627\u06CC\u0633 \u0627\u0648 \u0627\u06CC\u0646 \u0633\u0679\u0631\u0646\u06AF",
      e164: "\u0627\u06CC 164 \u0646\u0645\u0628\u0631",
      credit_card:
        "\u06A9\u0631\u06CC\u0688\u0679 \u06A9\u0627\u0631\u0688 \u0646\u0645\u0628\u0631",
      currency_code: "\u06A9\u0631\u0646\u0633\u06CC \u06A9\u0648\u0688",
      iban: "IBAN",
      jwt: "\u062C\u06D2 \u0688\u0628\u0644\u06CC\u0648 \u0679\u06CC",
      template_literal: "\u0627\u0646 \u067E\u0679",
    },
    o = {
      nan: "NaN",
      number: "\u0646\u0645\u0628\u0631",
      array: "\u0622\u0631\u06D2",
      null: "\u0646\u0644",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: instanceof ${r.expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${s} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`
          : `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${i} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${s} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${y(r.values[0])} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`
          : `\u063A\u0644\u0637 \u0622\u067E\u0634\u0646: ${g(r.values, "|")} \u0645\u06CC\u06BA \u0633\u06D2 \u0627\u06CC\u06A9 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u0628\u06C1\u062A \u0628\u0691\u0627: ${r.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u06D2 ${i}${r.maximum.toString()} ${a.unit ?? "\u0639\u0646\u0627\u0635\u0631"} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`
          : `\u0628\u06C1\u062A \u0628\u0691\u0627: ${r.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u0627 ${i}${r.maximum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${r.origin} \u06A9\u06D2 ${i}${r.minimum.toString()} ${a.unit} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`
          : `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${r.origin} \u06A9\u0627 ${i}${r.minimum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.prefix}" \u0633\u06D2 \u0634\u0631\u0648\u0639 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
          : i.format === "ends_with"
            ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.suffix}" \u067E\u0631 \u062E\u062A\u0645 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
            : i.format === "includes"
              ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.includes}" \u0634\u0627\u0645\u0644 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
              : i.format === "regex"
                ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: \u067E\u06CC\u0679\u0631\u0646 ${i.pattern} \u0633\u06D2 \u0645\u06CC\u0686 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
                : `\u063A\u0644\u0637 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u063A\u0644\u0637 \u0646\u0645\u0628\u0631: ${r.divisor} \u06A9\u0627 \u0645\u0636\u0627\u0639\u0641 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
      case "unrecognized_keys":
        return `\u063A\u06CC\u0631 \u062A\u0633\u0644\u06CC\u0645 \u0634\u062F\u06C1 \u06A9\u06CC${r.keys.length > 1 ? "\u0632" : ""}: ${g(r.keys, "\u060C ")}`;
      case "invalid_key":
        return `${r.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u06A9\u06CC`;
      case "invalid_union":
        return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
      case "invalid_element":
        return `${r.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u0648\u06CC\u0644\u06CC\u0648`;
      default:
        return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
    }
  };
};
function fg() {
  return { localeError: nb() };
}
var ib = () => {
  let e = {
    string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
    file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
    array: { unit: "element", verb: "bo\u2018lishi kerak" },
    set: { unit: "element", verb: "bo\u2018lishi kerak" },
    map: { unit: "yozuv", verb: "bo\u2018lishi kerak" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "kirish",
      email: "elektron pochta manzili",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO sana va vaqti",
      date: "ISO sana",
      time: "ISO vaqt",
      duration: "ISO davomiylik",
      ipv4: "IPv4 manzil",
      ipv6: "IPv6 manzil",
      mac: "MAC manzil",
      cidrv4: "IPv4 diapazon",
      cidrv6: "IPv6 diapazon",
      base64: "base64 kodlangan satr",
      base64url: "base64url kodlangan satr",
      json_string: "JSON satr",
      e164: "E.164 raqam",
      credit_card: "kredit karta raqami",
      currency_code: "valyuta kodi",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "kirish",
    },
    o = { nan: "NaN", number: "raqam", array: "massiv" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `Noto\u2018g\u2018ri kirish: kutilgan instanceof ${r.expected}, qabul qilingan ${s}`
          : `Noto\u2018g\u2018ri kirish: kutilgan ${i}, qabul qilingan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `Noto\u2018g\u2018ri kirish: kutilgan ${y(r.values[0])}`
          : `Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${i}${r.maximum.toString()} ${a.unit} ${a.verb}`
          : `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Juda kichik: kutilgan ${r.origin} ${i}${r.minimum.toString()} ${a.unit} ${a.verb}`
          : `Juda kichik: kutilgan ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Noto\u2018g\u2018ri satr: "${i.prefix}" bilan boshlanishi kerak`
          : i.format === "ends_with"
            ? `Noto\u2018g\u2018ri satr: "${i.suffix}" bilan tugashi kerak`
            : i.format === "includes"
              ? `Noto\u2018g\u2018ri satr: "${i.includes}" ni o\u2018z ichiga olishi kerak`
              : i.format === "regex"
                ? `Noto\u2018g\u2018ri satr: ${i.pattern} shabloniga mos kelishi kerak`
                : `Noto\u2018g\u2018ri ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Noto\u2018g\u2018ri raqam: ${r.divisor} ning karralisi bo\u2018lishi kerak`;
      case "unrecognized_keys":
        return `Noma\u2019lum kalit${r.keys.length > 1 ? "lar" : ""}: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} dagi kalit noto\u2018g\u2018ri`;
      case "invalid_union":
        return "Noto\u2018g\u2018ri kirish";
      case "invalid_element":
        return `${r.origin} da noto\u2018g\u2018ri qiymat`;
      default:
        return "Noto\u2018g\u2018ri kirish";
    }
  };
};
function mg() {
  return { localeError: ib() };
}
var ob = () => {
  let e = {
    string: { unit: "k\xFD t\u1EF1", verb: "c\xF3" },
    file: { unit: "byte", verb: "c\xF3" },
    array: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
    set: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
    map: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u0111\u1EA7u v\xE0o",
      email: "\u0111\u1ECBa ch\u1EC9 email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ng\xE0y gi\u1EDD ISO",
      date: "ng\xE0y ISO",
      time: "gi\u1EDD ISO",
      duration: "kho\u1EA3ng th\u1EDDi gian ISO",
      ipv4: "\u0111\u1ECBa ch\u1EC9 IPv4",
      ipv6: "\u0111\u1ECBa ch\u1EC9 IPv6",
      mac: "\u0111\u1ECBa ch\u1EC9 MAC",
      cidrv4: "d\u1EA3i IPv4",
      cidrv6: "d\u1EA3i IPv6",
      base64: "chu\u1ED7i m\xE3 h\xF3a base64",
      base64url: "chu\u1ED7i m\xE3 h\xF3a base64url",
      json_string: "chu\u1ED7i JSON",
      e164: "s\u1ED1 E.164",
      credit_card: "s\u1ED1 th\u1EBB t\xEDn d\u1EE5ng",
      currency_code: "m\xE3 ti\u1EC1n t\u1EC7",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u0111\u1EA7u v\xE0o",
    },
    o = { nan: "NaN", number: "s\u1ED1", array: "m\u1EA3ng" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i instanceof ${r.expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${s}`
          : `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${i}, nh\u1EADn \u0111\u01B0\u1EE3c ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${y(r.values[0])}`
          : `T\xF9y ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${r.origin ?? "gi\xE1 tr\u1ECB"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "ph\u1EA7n t\u1EED"}`
          : `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${r.origin ?? "gi\xE1 tr\u1ECB"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}`
          : `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng "${i.prefix}"`
          : i.format === "ends_with"
            ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i k\u1EBFt th\xFAc b\u1EB1ng "${i.suffix}"`
            : i.format === "includes"
              ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i bao g\u1ED3m "${i.includes}"`
              : i.format === "regex"
                ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i kh\u1EDBp v\u1EDBi m\u1EABu ${i.pattern}`
                : `${n[i.format] ?? r.format} kh\xF4ng h\u1EE3p l\u1EC7`;
      }
      case "not_multiple_of":
        return `S\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i l\xE0 b\u1ED9i s\u1ED1 c\u1EE7a ${r.divisor}`;
      case "unrecognized_keys":
        return `Kh\xF3a kh\xF4ng \u0111\u01B0\u1EE3c nh\u1EADn d\u1EA1ng: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `Kh\xF3a kh\xF4ng h\u1EE3p l\u1EC7 trong ${r.origin}`;
      case "invalid_union":
        return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
      case "invalid_element":
        return `Gi\xE1 tr\u1ECB kh\xF4ng h\u1EE3p l\u1EC7 trong ${r.origin}`;
      default:
        return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
    }
  };
};
function pg() {
  return { localeError: ob() };
}
var ab = () => {
  let e = {
    string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
    file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
    array: { unit: "\u9879", verb: "\u5305\u542B" },
    set: { unit: "\u9879", verb: "\u5305\u542B" },
    map: { unit: "\u9879", verb: "\u5305\u542B" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u8F93\u5165",
      email: "\u7535\u5B50\u90AE\u4EF6",
      url: "URL",
      emoji: "\u8868\u60C5\u7B26\u53F7",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO\u65E5\u671F\u65F6\u95F4",
      date: "ISO\u65E5\u671F",
      time: "ISO\u65F6\u95F4",
      duration: "ISO\u65F6\u957F",
      ipv4: "IPv4\u5730\u5740",
      ipv6: "IPv6\u5730\u5740",
      mac: "MAC\u5730\u5740",
      cidrv4: "IPv4\u7F51\u6BB5",
      cidrv6: "IPv6\u7F51\u6BB5",
      base64: "base64\u7F16\u7801\u5B57\u7B26\u4E32",
      base64url: "base64url\u7F16\u7801\u5B57\u7B26\u4E32",
      json_string: "JSON\u5B57\u7B26\u4E32",
      e164: "E.164\u53F7\u7801",
      credit_card: "\u4FE1\u7528\u5361\u53F7",
      currency_code: "\u8D27\u5E01\u4EE3\u7801",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u8F93\u5165",
    },
    o = {
      nan: "NaN",
      number: "\u6570\u5B57",
      array: "\u6570\u7EC4",
      null: "\u7A7A\u503C(null)",
    };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof ${r.expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${s}`
          : `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${i}\uFF0C\u5B9E\u9645\u63A5\u6536 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${y(r.values[0])}`
          : `\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${r.origin ?? "\u503C"} ${i}${r.maximum.toString()} ${a.unit ?? "\u4E2A\u5143\u7D20"}`
          : `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${r.origin ?? "\u503C"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${r.origin} ${i}${r.minimum.toString()} ${a.unit}`
          : `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${i.prefix}" \u5F00\u5934`
          : i.format === "ends_with"
            ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${i.suffix}" \u7ED3\u5C3E`
            : i.format === "includes"
              ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u5305\u542B "${i.includes}"`
              : i.format === "regex"
                ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u6EE1\u8DB3\u6B63\u5219\u8868\u8FBE\u5F0F ${i.pattern}`
                : `\u65E0\u6548${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u65E0\u6548\u6570\u5B57\uFF1A\u5FC5\u987B\u662F ${r.divisor} \u7684\u500D\u6570`;
      case "unrecognized_keys":
        return `\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} \u4E2D\u7684\u952E(key)\u65E0\u6548`;
      case "invalid_union":
        return "\u65E0\u6548\u8F93\u5165";
      case "invalid_element":
        return `${r.origin} \u4E2D\u5305\u542B\u65E0\u6548\u503C(value)`;
      default:
        return "\u65E0\u6548\u8F93\u5165";
    }
  };
};
function gg() {
  return { localeError: ab() };
}
var sb = () => {
  let e = {
    string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
    file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
    array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
    set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
    map: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u8F38\u5165",
      email: "\u90F5\u4EF6\u5730\u5740",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u65E5\u671F\u6642\u9593",
      date: "ISO \u65E5\u671F",
      time: "ISO \u6642\u9593",
      duration: "ISO \u671F\u9593",
      ipv4: "IPv4 \u4F4D\u5740",
      ipv6: "IPv6 \u4F4D\u5740",
      mac: "MAC \u4F4D\u5740",
      cidrv4: "IPv4 \u7BC4\u570D",
      cidrv6: "IPv6 \u7BC4\u570D",
      base64: "base64 \u7DE8\u78BC\u5B57\u4E32",
      base64url: "base64url \u7DE8\u78BC\u5B57\u4E32",
      json_string: "JSON \u5B57\u4E32",
      e164: "E.164 \u6578\u503C",
      credit_card: "\u4FE1\u7528\u5361\u865F",
      currency_code: "\u8CA8\u5E63\u4EE3\u78BC",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u8F38\u5165",
    },
    o = { nan: "NaN" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof ${r.expected}\uFF0C\u4F46\u6536\u5230 ${s}`
          : `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${i}\uFF0C\u4F46\u6536\u5230 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${y(r.values[0])}`
          : `\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${r.origin ?? "\u503C"} \u61C9\u70BA ${i}${r.maximum.toString()} ${a.unit ?? "\u500B\u5143\u7D20"}`
          : `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${r.origin ?? "\u503C"} \u61C9\u70BA ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${r.origin} \u61C9\u70BA ${i}${r.minimum.toString()} ${a.unit}`
          : `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${r.origin} \u61C9\u70BA ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${i.prefix}" \u958B\u982D`
          : i.format === "ends_with"
            ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${i.suffix}" \u7D50\u5C3E`
            : i.format === "includes"
              ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u5305\u542B "${i.includes}"`
              : i.format === "regex"
                ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u7B26\u5408\u683C\u5F0F ${i.pattern}`
                : `\u7121\u6548\u7684 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `\u7121\u6548\u7684\u6578\u5B57\uFF1A\u5FC5\u9808\u70BA ${r.divisor} \u7684\u500D\u6578`;
      case "unrecognized_keys":
        return `\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C${r.keys.length > 1 ? "\u5011" : ""}\uFF1A${g(r.keys, "\u3001")}`;
      case "invalid_key":
        return `${r.origin} \u4E2D\u6709\u7121\u6548\u7684\u9375\u503C`;
      case "invalid_union":
        return "\u7121\u6548\u7684\u8F38\u5165\u503C";
      case "invalid_element":
        return `${r.origin} \u4E2D\u6709\u7121\u6548\u7684\u503C`;
      default:
        return "\u7121\u6548\u7684\u8F38\u5165\u503C";
    }
  };
};
function vg() {
  return { localeError: sb() };
}
var ub = () => {
  let e = {
    string: { unit: "\xE0mi", verb: "n\xED" },
    file: { unit: "bytes", verb: "n\xED" },
    array: { unit: "nkan", verb: "n\xED" },
    set: { unit: "nkan", verb: "n\xED" },
    map: { unit: "nkan", verb: "n\xED" },
  };
  function t(r) {
    return e[r] ?? null;
  }
  let n = {
      regex: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
      email: "\xE0d\xEDr\u1EB9\u0301s\xEC \xECm\u1EB9\u0301l\xEC",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\xE0k\xF3k\xF2 ISO",
      date: "\u1ECDj\u1ECD\u0301 ISO",
      time: "\xE0k\xF3k\xF2 ISO",
      duration: "\xE0k\xF3k\xF2 t\xF3 p\xE9 ISO",
      ipv4: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv4",
      ipv6: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv6",
      mac: "\xE0d\xEDr\u1EB9\u0301s\xEC MAC",
      cidrv4: "\xE0gb\xE8gb\xE8 IPv4",
      cidrv6: "\xE0gb\xE8gb\xE8 IPv6",
      base64: "\u1ECD\u0300r\u1ECD\u0300 t\xED a k\u1ECD\u0301 n\xED base64",
      base64url: "\u1ECD\u0300r\u1ECD\u0300 base64url",
      json_string: "\u1ECD\u0300r\u1ECD\u0300 JSON",
      e164: "n\u1ECD\u0301mb\xE0 E.164",
      credit_card: "n\u1ECDmba kaadi gbese",
      currency_code: "koodu ow\xF3",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
    },
    o = { nan: "NaN", number: "n\u1ECD\u0301mb\xE0", array: "akop\u1ECD" };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        let i = o[r.expected] ?? r.expected,
          a = $(r.input),
          s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected)
          ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi instanceof ${r.expected}, \xE0m\u1ECD\u0300 a r\xED ${s}`
          : `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${i}, \xE0m\u1ECD\u0300 a r\xED ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1
          ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${y(r.values[0])}`
          : `\xC0\u1E63\xE0y\xE0n a\u1E63\xEC\u1E63e: yan \u1ECD\u0300kan l\xE1ra ${g(r.values, "|")}`;
      case "too_big": {
        let i = r.inclusive ? "<=" : "<",
          a = t(r.origin);
        return a
          ? `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${r.origin ?? "iye"} ${a.verb} ${i}${r.maximum} ${a.unit}`
          : `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 ${i}${r.maximum}`;
      }
      case "too_small": {
        let i = r.inclusive ? ">=" : ">",
          a = t(r.origin);
        return a
          ? `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${r.origin} ${a.verb} ${i}${r.minimum} ${a.unit}`
          : `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 ${i}${r.minimum}`;
      }
      case "invalid_format": {
        let i = r;
        return i.format === "starts_with"
          ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\u1EB9\u0300r\u1EB9\u0300 p\u1EB9\u0300l\xFA "${i.prefix}"`
          : i.format === "ends_with"
            ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 par\xED p\u1EB9\u0300l\xFA "${i.suffix}"`
            : i.format === "includes"
              ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 n\xED "${i.includes}"`
              : i.format === "regex"
                ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\xE1 \xE0p\u1EB9\u1EB9r\u1EB9 mu ${i.pattern}`
                : `A\u1E63\xEC\u1E63e: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `N\u1ECD\u0301mb\xE0 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 j\u1EB9\u0301 \xE8y\xE0 p\xEDp\xEDn ti ${r.divisor}`;
      case "unrecognized_keys":
        return `B\u1ECDt\xECn\xEC \xE0\xECm\u1ECD\u0300: ${g(r.keys, ", ")}`;
      case "invalid_key":
        return `B\u1ECDt\xECn\xEC a\u1E63\xEC\u1E63e n\xEDn\xFA ${r.origin}`;
      case "invalid_union":
        return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
      case "invalid_element":
        return `Iye a\u1E63\xEC\u1E63e n\xEDn\xFA ${r.origin}`;
      default:
        return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
    }
  };
};
function hg() {
  return { localeError: ub() };
}
var yg,
  lc = Symbol("ZodOutput"),
  dc = Symbol("ZodInput"),
  ao = class {
    constructor() {
      ((this._map = new WeakMap()), (this._idmap = new Map()));
    }
    add(t, ...n) {
      let o = n[0];
      return (
        this._map.set(t, o),
        o && typeof o == "object" && "id" in o && this._idmap.set(o.id, t),
        this
      );
    }
    clear() {
      return ((this._map = new WeakMap()), (this._idmap = new Map()), this);
    }
    remove(t) {
      let n = this._map.get(t);
      return (
        n && typeof n == "object" && "id" in n && this._idmap.delete(n.id),
        this._map.delete(t),
        this
      );
    }
    get(t) {
      let n = t._zod.parent;
      if (n) {
        let o = { ...(this.get(n) ?? {}) };
        delete o.id;
        let r = { ...o, ...this._map.get(t) };
        return Object.keys(r).length ? r : void 0;
      }
      return this._map.get(t);
    }
    has(t) {
      return this._map.has(t);
    }
  };
function so() {
  return new ao();
}
(yg = globalThis).__zod_globalRegistry ?? (yg.__zod_globalRegistry = so());
var ue = globalThis.__zod_globalRegistry;
var me = Symbol.for("zod.compile.invalid"),
  $g = Symbol.for("zod.compile.fallback"),
  De = class extends Error {
    constructor(
      t = "z.compile does not support async refinements, transforms, or checks",
    ) {
      (super(t), (this.name = "ZodCompileAsyncError"));
    }
  },
  M = class extends Error {
    constructor(t, n = !0) {
      (super(
        `z.compile does not support ${t}; this schema must use the runtime parser`,
      ),
        (this.name = "ZodCompileUnsupportedError"),
        (this.islandable = n));
    }
  };
function lb(e, t) {
  try {
    return co(e, { assertOnly: !0 });
  } catch {
    return t;
  }
}
function gc(e, t) {
  try {
    let n = co(e),
      o = uo(e, n);
    return ((o._zod.bag.validator = lb(e, n)), o);
  } catch (n) {
    if (t?.strict) throw n;
    return e;
  }
}
function uo(e, t) {
  if (to(e)) throw new M("a schema whose subtree contains a reference cycle");
  let n = W(e),
    o = e._zod.run,
    r = o.__originalRun ?? o,
    i = (a, s) => {
      if (
        s?.async ||
        s?.direction === "backward" ||
        s?.skipChecks ||
        s?.[$g] ||
        (s && ro(s, a.value))
      )
        return r(a, s);
      let c = t(a.value);
      return c !== me ? ((a.value = c), a) : (s && (s[$g] = !0), r(a, s));
    };
  return (
    (i.__originalRun = r),
    (n._zod.bag.fallbackRun = r),
    (n._zod.bag.validator = t),
    (n._zod.run = i),
    o.__originalRun || db(n, e, t),
    n
  );
}
function db(e, t, n) {
  let o = e,
    r = t;
  if (typeof r.safeParse == "function") {
    let i = r.safeParse;
    o.safeParse = (a, s) => {
      let c = n(a);
      return c !== me ? { success: !0, data: c } : i(a, s);
    };
  }
  if (typeof r.parse == "function") {
    let i = r.parse;
    o.parse = (a, s) => {
      let c = n(a);
      return c !== me ? c : i(a, s);
    };
  }
}
function co(e, t) {
  let n = !0;
  try {
    n = to(e);
  } catch {}
  if (n) throw new M("a schema whose subtree contains a reference cycle");
  let o = {
      constants: new Map(),
      constantCounter: 0,
      varCounter: 0,
      definite: !0,
    },
    r = new kt(["input"]),
    i = Q(r, o, e, "input", !t?.assertOnly);
  r.write(i === null ? "return true;" : `return ${i};`);
  let a = ["INVALID", ...o.constants.keys()],
    s = [me, ...o.constants.values()],
    c = r.content.join(`
`),
    u = t?.debug
      ? a.length > 0
        ? `// Constants: ${a.join(", ")}
${c}`
        : c
      : "",
    l = Function,
    d = `return (input) => {
${c}
}`,
    f;
  try {
    f = new l(...a, d)(...s);
  } catch (m) {
    throw new M(
      `this schema (generated code failed to evaluate: ${m.message})`,
    );
  }
  return (t?.debug && (f.code = u), (f.definite = o.definite), f);
}
function U(e, t) {
  for (let [o, r] of e.constants) if (r === t) return o;
  let n = `c${e.constantCounter++}`;
  return (e.constants.set(n, t), n);
}
function St(e, t) {
  return ((e.definite = !1), U(e, t));
}
function A(e) {
  return `v${e.varCounter++}`;
}
function fb(e, t) {
  let n = e._zod.run({ value: t, issues: [] }, {});
  if (n && typeof n.then == "function") return me;
  let o = n;
  return o.issues.length === 0 ? o.value : me;
}
function ce(e, t, n, o, r = !0) {
  let i = e.content.length,
    a = t.constants.size,
    s = t.constantCounter,
    c = t.varCounter;
  try {
    return Q(e, t, n, o, r);
  } catch (u) {
    if (!(u instanceof M) || !u.islandable) throw u;
    if (((e.content.length = i), t.constants.size > a)) {
      let l = Array.from(t.constants.keys()).slice(a);
      for (let d of l) t.constants.delete(d);
    }
    return ((t.constantCounter = s), (t.varCounter = c), mb(e, t, n, o));
  }
}
function mb(e, t, n, o) {
  t.definite = !1;
  let r = U(t, n),
    i = U(t, fb),
    a = A(t);
  return (
    e.write(`const ${a} = ${i}(${r}, ${o});`),
    e.write(`if (${a} === INVALID) return INVALID;`),
    a
  );
}
var pb = new Set([
  "max_size",
  "min_size",
  "size_equals",
  "max_length",
  "min_length",
  "length_equals",
]);
function gb(e, t, n, o) {
  let r = n._zod.def.checks;
  if (!r || r.length === 0) return o;
  let i = o;
  for (let a of r) {
    let s = a._zod.def;
    if (s.when && !pb.has(s.check))
      throw new M('check with a custom "when" condition');
    switch (s.check) {
      case "greater_than":
        vb(e, t, s, i);
        break;
      case "less_than":
        hb(e, t, s, i);
        break;
      case "multiple_of":
        yb(e, t, s, i);
        break;
      case "number_format":
        Ig(e, s, i);
        break;
      case "min_length": {
        let c = at(s.minimum, "min_length"),
          u = fc(
            e,
            t,
            i,
            `${i}.length >= ${c} && ${i}.length < ${s.minimum * 2}`,
          );
        e.write(`if (${u} < ${c}) return INVALID;`);
        break;
      }
      case "max_length": {
        let c = at(s.maximum, "max_length"),
          u = fc(e, t, i, `${i}.length > ${c}`);
        e.write(`if (${u} > ${c}) return INVALID;`);
        break;
      }
      case "length_equals": {
        let c = at(s.length, "length_equals"),
          u = fc(
            e,
            t,
            i,
            `${i}.length >= ${c} && ${i}.length <= ${s.length * 2}`,
          );
        e.write(`if (${u} !== ${c}) return INVALID;`);
        break;
      }
      case "min_size":
        e.write(
          `if (${i}.size < ${at(s.minimum, "min_size")}) return INVALID;`,
        );
        break;
      case "max_size":
        e.write(
          `if (${i}.size > ${at(s.maximum, "max_size")}) return INVALID;`,
        );
        break;
      case "size_equals":
        e.write(
          `if (${i}.size !== ${at(s.size, "size_equals")}) return INVALID;`,
        );
        break;
      case "string_format":
        i = Sg(e, t, s, i);
        break;
      case "custom":
        i = wb(e, t, a, i);
        break;
      case "bigint_format":
        $b(e, s, i);
        break;
      case "mime_type":
        _b(e, t, s, i);
        break;
      case "property":
        xb(e, t, s, i);
        break;
      case "properties":
        bb(e, t, s, i);
        break;
      case "overwrite": {
        let c = A(t);
        (kb(e, t, a, i, c), (i = c));
        break;
      }
      default:
        throw new M(`check type ${s.check}`);
    }
  }
  return i;
}
function fc(e, t, n, o) {
  let r = U(t, bt),
    i = A(t);
  return (
    e.write(
      `const ${i} = typeof ${n} === "string" && ${o} ? ${r}(${n}) : ${n}.length;`,
    ),
    i
  );
}
function at(e, t) {
  if (typeof e != "number" || !Number.isFinite(e))
    throw new M(`${t} bound of type ${typeof e}`);
  return `${e}`;
}
function wg(e, t) {
  if (typeof t == "bigint") return `${t}n`;
  if (typeof t == "number") {
    if (Number.isNaN(t)) throw new M("comparison check with NaN bound");
    return `${t}`;
  }
  if (t instanceof Date) {
    if (Number.isNaN(t.getTime()))
      throw new M("comparison check with Invalid Date bound");
    return U(e, t);
  }
  throw new M(`comparison check bound of type ${typeof t}`);
}
function vb(e, t, n, o) {
  let r = n.inclusive ? "<" : "<=";
  e.write(`if (${o} ${r} ${wg(t, n.value)}) return INVALID;`);
}
function hb(e, t, n, o) {
  let r = n.inclusive ? ">" : ">=";
  e.write(`if (${o} ${r} ${wg(t, n.value)}) return INVALID;`);
}
function yb(e, t, n, o) {
  if (typeof n.value == "bigint") {
    if (n.value === BigInt(0))
      throw new M("multiple_of check with a zero divisor");
    e.write(`if (${o} % ${n.value}n !== 0n) return INVALID;`);
  } else {
    let r = U(t, Wr);
    e.write(
      `if (${r}(${o}, ${at(n.value, "multiple_of")}) !== 0) return INVALID;`,
    );
  }
}
function Ig(e, t, n) {
  let o = t.format;
  switch (o) {
    case "safeint":
      e.write(`if (!Number.isSafeInteger(${n})) return INVALID;`);
      break;
    case "int32":
      e.write(
        `if (!Number.isInteger(${n}) || ${n} < -2147483648 || ${n} > 2147483647) return INVALID;`,
      );
      break;
    case "uint32":
      e.write(
        `if (!Number.isInteger(${n}) || ${n} < 0 || ${n} > 4294967295) return INVALID;`,
      );
      break;
    case "float32":
      e.write(
        `if (!Number.isFinite(${n}) || ${n} < -3.4028234663852886e38 || ${n} > 3.4028234663852886e38) return INVALID;`,
      );
      break;
    case "float64":
      e.write(`if (!Number.isFinite(${n})) return INVALID;`);
      break;
    default:
      throw new M(`number format ${o}`);
  }
}
function $b(e, t, n) {
  let o = t.format;
  if (o)
    switch (o) {
      case "int64":
        e.write(
          `if (${n} < -9223372036854775808n || ${n} > 9223372036854775807n) return INVALID;`,
        );
        break;
      case "uint64":
        e.write(
          `if (${n} < 0n || ${n} > 18446744073709551615n) return INVALID;`,
        );
        break;
      default:
        throw new M(`bigint format ${o}`);
    }
}
function _b(e, t, n, o) {
  let r = n.mime;
  if (r && r.length > 0) {
    let i = U(t, new Set(r));
    e.write(`if (!${i}.has(${o}.type)) return INVALID;`);
  }
}
function bb(e, t, n, o) {
  if (n.when) throw new M('check with a custom "when" condition');
  e.write(`if (${o} == null) return INVALID;`);
  let r = n.shape;
  for (let i of Reflect.ownKeys(r)) {
    let a = typeof i == "symbol" ? U(t, i) : de(i),
      s = A(t);
    (e.write(`const ${s} = ${o}[${a}];`), ce(e, t, r[i], s, !1));
  }
}
function xb(e, t, n, o) {
  let r = `${o}[${JSON.stringify(n.property)}]`;
  Q(e, t, n.schema, r);
}
function kb(e, t, n, o, r) {
  let i = n._zod.def.tx;
  if (!i) throw new M("overwrite check without a transform function");
  if (zt(i))
    throw new De("z.compile: async overwrite transforms are not supported");
  let a = U(t, i);
  e.write(`const ${r} = ${a}(${o});`);
}
function mc() {
  throw new _e();
}
function vc(e) {
  this.issues.push(e);
}
function wb(e, t, n, o) {
  let r = n._zod.def;
  if (r.fn) {
    if (zt(r.fn))
      throw new De("z.compile: async .refine() predicates are not supported");
    let i = St(t, r.fn),
      a = U(t, mc),
      s = A(t);
    return (
      e.write(`const ${s} = ${i}(${o});`),
      e.write(`if (${s} instanceof Promise) ${a}();`),
      e.write(`if (!${s}) return INVALID;`),
      o
    );
  }
  if (n._zod.check) {
    if (zt(n._zod.check))
      throw new De(
        "z.compile: async .superRefine() / check functions are not supported",
      );
    let i = n._zod.check,
      s = St(t, (u) => {
        let l = { value: u, issues: [], addIssue: vc };
        return (
          i(l) instanceof Promise && mc(),
          l.issues.length === 0 ? l.value : me
        );
      }),
      c = A(t);
    return (
      e.write(`const ${c} = ${s}(${o});`),
      e.write(`if (${c} === INVALID) return INVALID;`),
      c
    );
  }
  throw new M("custom check without a predicate or check function");
}
var Ib = new Set([
  "cidrv4",
  "cuid",
  "cuid2",
  "date",
  "datetime",
  "duration",
  "e164",
  "email",
  "emoji",
  "ends_with",
  "guid",
  "includes",
  "ipv4",
  "ksuid",
  "lowercase",
  "mac",
  "nanoid",
  "regex",
  "starts_with",
  "time",
  "ulid",
  "uppercase",
  "uuid",
  "xid",
]);
function Sg(e, t, n, o, r = !0) {
  let i = n.format;
  if (i === "base64") {
    let u = U(t, pn);
    return (e.write(`if (!${u}(${o})) return INVALID;`), o);
  }
  if (i === "base64url") {
    let u = U(t, Fi);
    return (e.write(`if (!${u}(${o})) return INVALID;`), o);
  }
  if (i === "jwt") {
    let u = U(t, Bi),
      l = U(t, n.alg ?? null);
    return (e.write(`if (!${u}(${o}, ${l})) return INVALID;`), o);
  }
  if (i === "ipv6") {
    let u = U(t, mn);
    return (e.write(`if (!${u}(${o})) return INVALID;`), o);
  }
  if (i === "cidrv6") {
    let u = U(t, Ri);
    return (e.write(`if (!${u}(${o})) return INVALID;`), o);
  }
  if (i === "credit_card") {
    let u = U(t, Mi);
    return (e.write(`if (!${u}(${o})) return INVALID;`), o);
  }
  if (i === "iban") {
    let u = U(t, Ji);
    return (e.write(`if (!${u}(${o})) return INVALID;`), o);
  }
  let a = n;
  if (
    i === "url" ||
    i === "httpurl" ||
    a.normalize ||
    a.hostname !== void 0 ||
    a.protocol !== void 0
  ) {
    let u = U(t, Zi),
      l = U(t, n),
      d = A(t),
      f = A(t);
    if (
      (e.write(`const ${d} = ${o}.trim();`),
      e.write(`const ${f} = ${u}(${d}, ${l});`),
      e.write(`if (typeof ${f} === "number") return INVALID;`),
      a.hostname !== void 0)
    ) {
      let _ = U(t, Ci);
      e.write(`if (!${_}(${f}, ${l}.hostname)) return INVALID;`);
    }
    if (a.protocol !== void 0) {
      let _ = U(t, Li);
      e.write(`if (!${_}(${f}, ${l}.protocol)) return INVALID;`);
    }
    if (!r) return null;
    let m = A(t),
      v = a.normalize ? `${f}.href` : `${U(t, fn)}(${d})`;
    return (e.write(`const ${m} = ${v};`), m);
  }
  let s = n.fn;
  if (s) {
    if (zt(s)) throw new M(`async string format ${i}`);
    let u = U(t, s);
    return (e.write(`if (!${u}(${o})) return INVALID;`), o);
  }
  if (Ib.has(i) && n.pattern) {
    let u = U(t, n.pattern);
    return (
      e.write(`${u}.lastIndex = 0;`),
      e.write(`if (!${u}.test(${o})) return INVALID;`),
      o
    );
  }
  let c = n.format;
  switch (c) {
    case "regex":
      throw new M("regex format without a pattern");
    case "lowercase":
      e.write(`if (${o} !== ${o}.toLowerCase()) return INVALID;`);
      break;
    case "uppercase":
      e.write(`if (${o} !== ${o}.toUpperCase()) return INVALID;`);
      break;
    case "includes":
      e.write(`if (!${o}.includes(${de(n.includes)})) return INVALID;`);
      break;
    case "starts_with": {
      let u = n.prefix;
      e.write(`if (${o}.slice(0, ${u.length}) !== ${de(u)}) return INVALID;`);
      break;
    }
    case "ends_with": {
      let u = n.suffix;
      e.write(`if (${o}.slice(-${u.length}) !== ${de(u)}) return INVALID;`);
      break;
    }
    default:
      throw new M(`string format ${c}`);
  }
  return o;
}
function Q(e, t, n, o, r = !0) {
  let i = n._zod.def,
    a = i.type;
  if (i.coerce) throw new M(`coercion (z.coerce.${a}())`);
  let s = r || !!i.checks?.length,
    c;
  switch (a) {
    case "string":
      c = Sb(e, t, n, o, s);
      break;
    case "number":
      c = zb(e, n, o);
      break;
    case "boolean":
      c = Pb(e, o);
      break;
    case "bigint":
      c = Ob(e, n, o);
      break;
    case "symbol":
      c = jb(e, o);
      break;
    case "undefined":
      c = Nb(e, o);
      break;
    case "null":
      c = Tb(e, o);
      break;
    case "any":
    case "unknown":
      c = o;
      break;
    case "never":
      (e.write("return INVALID;"), (c = o));
      break;
    case "void":
      c = Ab(e, o);
      break;
    case "nan":
      c = Db(e, o);
      break;
    case "date":
      c = Ub(e, o);
      break;
    case "object":
      c = Eb(e, t, n, o, s);
      break;
    case "optional":
      c = Zb(e, t, n, o, s);
      break;
    case "nullable":
      c = Rb(e, t, n, o, s);
      break;
    case "array":
      c = Vb(e, t, n, o, s);
      break;
    case "literal":
      c = Fb(e, t, n, o);
      break;
    case "enum":
      c = Mb(e, t, n, o);
      break;
    case "readonly": {
      let u = bg(e, t, n, o),
        l = A(t);
      (e.write(`const ${l} = Object.freeze(${u});`), (c = l));
      break;
    }
    case "success":
      (bg(e, t, n, o), (c = "true"));
      break;
    case "default":
    case "prefault":
      c = Jb(e, t, n, o);
      break;
    case "nonoptional":
      c = Bb(e, t, n, o);
      break;
    case "tuple":
      c = Kb(e, t, n, o);
      break;
    case "union":
      c = Wb(e, t, n, o);
      break;
    case "intersection":
      c = Xb(e, t, n, o);
      break;
    case "record":
      c = Hb(e, t, n, o);
      break;
    case "map":
      c = Qb(e, t, n, o);
      break;
    case "set":
      c = ex(e, t, n, o);
      break;
    case "file":
      c = tx(e, o);
      break;
    case "template_literal":
      c = rx(e, t, n, o);
      break;
    case "lazy":
      c = nx(e, t, n, o);
      break;
    case "pipe":
      c = ix(e, t, n, o);
      break;
    case "custom":
      c = ox(e, t, n, o);
      break;
    case "transform":
      c = ux(e, t, n, o);
      break;
    case "catch":
      c = sx(e, t, n, o);
      break;
    default:
      throw new M(`schema type ${a}`);
  }
  return c === null ? null : gb(e, t, n, c);
}
function Sb(e, t, n, o, r = !0) {
  e.write(`if (typeof ${o} !== "string") return INVALID;`);
  let i = n._zod.def;
  return i.format === void 0 ? o : Sg(e, t, i, o, r);
}
function zb(e, t, n) {
  e.write(
    `if (typeof ${n} !== "number" || !Number.isFinite(${n})) return INVALID;`,
  );
  let o = t._zod.def;
  return (
    o.check === "number_format" && o.format && Ig(e, { format: o.format }, n),
    n
  );
}
function Pb(e, t) {
  return (e.write(`if (typeof ${t} !== "boolean") return INVALID;`), t);
}
function Ob(e, t, n) {
  e.write(`if (typeof ${n} !== "bigint") return INVALID;`);
  let o = t._zod.def;
  if (o.format)
    switch (o.format) {
      case "int64":
        e.write(
          `if (${n} < -9223372036854775808n || ${n} > 9223372036854775807n) return INVALID;`,
        );
        break;
      case "uint64":
        e.write(
          `if (${n} < 0n || ${n} > 18446744073709551615n) return INVALID;`,
        );
        break;
    }
  return n;
}
function jb(e, t) {
  return (e.write(`if (typeof ${t} !== "symbol") return INVALID;`), t);
}
function Nb(e, t) {
  return (e.write(`if (${t} !== undefined) return INVALID;`), t);
}
function Tb(e, t) {
  return (e.write(`if (${t} !== null) return INVALID;`), t);
}
function Ab(e, t) {
  return (e.write(`if (${t} !== undefined) return INVALID;`), t);
}
function Db(e, t) {
  return (
    e.write(
      `if (typeof ${t} !== "number" || !Number.isNaN(${t})) return INVALID;`,
    ),
    t
  );
}
function Ub(e, t) {
  return (
    e.write(
      `if (!(${t} instanceof Date) || Number.isNaN(${t}.getTime())) return INVALID;`,
    ),
    t
  );
}
function Eb(e, t, n, o, r = !0) {
  let i = n._zod.def;
  e.write(
    `if (typeof ${o} !== "object" || ${o} === null || Array.isArray(${o})) return INVALID;`,
  );
  let a = i.shape,
    s = Object.keys(a),
    c = Object.getOwnPropertySymbols(a),
    u = c.length ? [...s, ...c] : s,
    l = (j) => (typeof j == "symbol" ? U(t, j) : de(j)),
    d = (j) => (typeof j == "symbol" ? `[${l(j)}]` : de(j)),
    f = a;
  if (s.includes("__proto__")) throw new M('object shape key "__proto__"');
  let m = new Map();
  for (let j of u) {
    let Z = f[j],
      B = l(j),
      I = A(t);
    if ((e.write(`const ${I} = ${o}[${B}];`), Z._zod.optin !== void 0)) {
      let b = A(t);
      (e.write(`let ${b} = (() => {`),
        e.indented((D) => {
          let ee = ce(D, t, Z, I);
          D.write(`return ${ee};`);
        }),
        e.write("})();"),
        Z._zod.optout === "optional"
          ? (e.write(`if (${b} === INVALID) {`),
            e.indented((D) => {
              (D.write(`if (${B} in ${o}) return INVALID;`),
                D.write(`${b} = undefined;`));
            }),
            e.write("}"))
          : e.write(`if (${b} === INVALID) return INVALID;`),
        m.set(j, b));
    } else {
      Lb(Z) && e.write(`if (!(${B} in ${o})) return INVALID;`);
      let b = ce(e, t, Z, I, r);
      b !== null && m.set(j, b);
    }
  }
  let v = i.catchall,
    _ = "none";
  if (v) {
    let j = v._zod.def.type;
    if (j === "never") {
      let Z = s.map((B) => `k !== ${de(B)}`).join(" && ") || "true";
      (e.write(`for (const k in ${o}) {`),
        e.indented((B) => {
          B.write(`if (${Z}) return INVALID;`);
        }),
        e.write("}"));
    } else
      (j === "unknown" || j === "any") && !v._zod.def.checks?.length
        ? (_ = "passthrough")
        : (_ = "schema");
  }
  let S = A(t),
    T = u.some((j) => _g(f[j]) || pc(f[j]));
  if (!r) {
    if (_ === "schema") {
      let j = s.length > 0 ? U(t, new Set(s)) : null;
      (e.write(`for (const k in ${o}) {`),
        e.indented((Z) => {
          (Z.write('if (k === "__proto__") continue;'),
            j && Z.write(`if (${j}.has(k)) continue;`));
          let B = A(t);
          (Z.write(`const ${B} = ${o}[k];`), ce(Z, t, v, B, !1));
        }),
        e.write("}"));
    }
    return null;
  }
  if (T) {
    e.write(`const ${S} = {};`);
    for (let j of u) {
      let Z = l(j),
        B = m.get(j);
      pc(f[j])
        ? e.write(`if (${Z} in ${o}) ${S}[${Z}] = ${B};`)
        : _g(f[j])
          ? e.write(
              `if (${B} !== undefined || ${Z} in ${o}) ${S}[${Z}] = ${B};`,
            )
          : e.write(`${S}[${Z}] = ${B};`);
    }
  } else {
    let j = u.map((Z) => `${d(Z)}: ${m.get(Z)}`).join(", ");
    e.write(`const ${S} = { ${j} };`);
  }
  if (_ !== "none") {
    let j = s.length > 0 ? U(t, new Set(s)) : null;
    (e.write(`for (const k in ${o}) {`),
      e.indented((Z) => {
        if (
          (Z.write('if (k === "__proto__") continue;'),
          j && Z.write(`if (${j}.has(k)) continue;`),
          _ === "passthrough")
        )
          Z.write(`${S}[k] = ${o}[k];`);
        else {
          let B = A(t);
          Z.write(`const ${B} = ${o}[k];`);
          let I = ce(Z, t, v, B);
          Z.write(`${S}[k] = ${I};`);
        }
      }),
      e.write("}"));
  }
  return S;
}
function Zb(e, t, n, o, r = !0) {
  let i = n._zod.def;
  if (Cb(n)) return Q(e, t, i.innerType, o, r);
  if (i.innerType._zod.optin === "defaulted") {
    let s = A(t),
      c = A(t);
    return (
      e.write(`let ${s};`),
      e.write(`if (${o} === undefined) {`),
      e.indented((u) => {
        (u.write(`const ${c} = (() => {`),
          u.indented((l) => {
            let d = Q(l, t, i.innerType, o);
            l.write(`return ${d};`);
          }),
          u.write("})();"),
          u.write(`if (${c} !== INVALID) ${s} = ${c};`));
      }),
      e.write("} else {"),
      e.indented((u) => {
        let l = Q(u, t, i.innerType, o);
        u.write(`${s} = ${l};`);
      }),
      e.write("}"),
      s
    );
  }
  let a = r ? A(t) : null;
  return (
    a && e.write(`let ${a};`),
    e.write(`if (${o} !== undefined) {`),
    e.indented((s) => {
      let c = Q(s, t, i.innerType, o, r);
      a && c !== null && s.write(`${a} = ${c};`);
    }),
    e.write("}"),
    a
  );
}
function Cb(e) {
  return e._zod.traits?.has("$ZodExactOptional") === !0;
}
function Lb(e) {
  return e._zod.optin === void 0 && It(e);
}
function It(e) {
  if (e._zod.def.coerce) return !0;
  let t = e._zod.def;
  switch (t.type) {
    case "any":
    case "unknown":
    case "undefined":
    case "void":
    case "default":
    case "prefault":
    case "transform":
    case "custom":
    case "lazy":
      return !0;
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "symbol":
    case "null":
    case "never":
    case "nan":
    case "date":
    case "object":
    case "array":
    case "tuple":
    case "record":
    case "map":
    case "set":
    case "file":
    case "template_literal":
      return !1;
    case "nonoptional":
      return t.innerType ? It(t.innerType) : !1;
    case "literal":
      return !!t.values?.includes(void 0);
    case "enum":
      return !!e._zod.values?.has(void 0);
    case "optional":
    case "nullable":
    case "readonly":
    case "success":
      return t.innerType ? It(t.innerType) : !0;
    case "catch":
      return !0;
    case "union":
      return t.options ? t.options.some(It) : !0;
    case "intersection":
      return !t.left || !t.right ? !0 : It(t.left) && It(t.right);
    case "pipe":
      return t.in ? It(t.in) : !0;
    default:
      return !0;
  }
}
function pc(e) {
  return e._zod.optin === "optional" && e._zod.optout === "optional";
}
function _g(e) {
  return (
    (e._zod.optin !== "defaulted" || e._zod.optout === "optional") && nr(e)
  );
}
function nr(e) {
  let t = e._zod.def;
  switch (t.type) {
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "symbol":
    case "null":
    case "nan":
    case "date":
    case "object":
    case "array":
    case "tuple":
    case "record":
    case "map":
    case "set":
    case "file":
    case "template_literal":
    case "never":
    case "success":
      return !1;
    case "literal":
      return !!t.values?.includes(void 0);
    case "enum":
      return !!e._zod.values?.has(void 0);
    case "optional":
      return !0;
    case "nullable":
    case "readonly":
    case "nonoptional":
      return t.innerType ? nr(t.innerType) : !0;
    case "union":
      return t.options ? t.options.some(nr) : !0;
    case "intersection":
      return !t.left || !t.right || nr(t.left) || nr(t.right);
    case "pipe":
      return t.out ? nr(t.out) : !0;
    default:
      return !0;
  }
}
function Rb(e, t, n, o, r = !0) {
  let i = n._zod.def,
    a = r ? A(t) : null;
  return (
    a && e.write(`let ${a} = null;`),
    e.write(`if (${o} !== null) {`),
    e.indented((s) => {
      let c = Q(s, t, i.innerType, o, r);
      a && c !== null && s.write(`${a} = ${c};`);
    }),
    e.write("}"),
    a
  );
}
function hc(e, t, n) {
  for (let [o, r] of Wt(t._zod.def.checks))
    e.write(`if (${n} > ${at(o, r._zod.def.check)}) return INVALID;`);
}
function Vb(e, t, n, o, r = !0) {
  let i = n._zod.def;
  (e.write(`if (!Array.isArray(${o})) return INVALID;`),
    hc(e, n, `${o}.length`));
  let a = r ? A(t) : null,
    s = A(t),
    c = A(t);
  return (
    a && e.write(`const ${a} = new Array(${o}.length);`),
    e.write(`for (let ${s} = 0; ${s} < ${o}.length; ${s}++) {`),
    e.indented((u) => {
      u.write(`const ${c} = ${o}[${s}];`);
      let l = ce(u, t, i.element, c, r);
      a && l !== null && u.write(`${a}[${s}] = ${l};`);
    }),
    e.write("}"),
    a
  );
}
function Fb(e, t, n, o) {
  let i = n._zod.def.values;
  if (i.length !== 1) {
    let s = U(t, new Set(i));
    return (e.write(`if (!${s}.has(${o})) return INVALID;`), o);
  }
  let a = i[0];
  if (typeof a == "number" && Number.isNaN(a)) {
    let s = U(t, new Set(i));
    return (e.write(`if (!${s}.has(${o})) return INVALID;`), o);
  }
  if (typeof a == "string") e.write(`if (${o} !== ${de(a)}) return INVALID;`);
  else if (typeof a == "number" || typeof a == "boolean")
    e.write(`if (${o} !== ${a}) return INVALID;`);
  else if (a === null) e.write(`if (${o} !== null) return INVALID;`);
  else if (a === void 0) e.write(`if (${o} !== undefined) return INVALID;`);
  else if (typeof a == "bigint") e.write(`if (${o} !== ${a}n) return INVALID;`);
  else throw new M(`literal type ${typeof a}`);
  return o;
}
function Mb(e, t, n, o) {
  let r = n._zod.values;
  if (!r) throw new M("enum schema without enumerated values");
  let i = U(t, r);
  return (e.write(`if (!${i}.has(${o})) return INVALID;`), o);
}
function bg(e, t, n, o) {
  let r = n._zod.def;
  return Q(e, t, r.innerType, o);
}
function Jb(e, t, n, o) {
  let r = n._zod.def,
    a = Object.getOwnPropertyDescriptor(n._zod.def, "defaultValue")
      ? () => n._zod.def.defaultValue
      : void 0;
  if (n._zod.def.type === "prefault") {
    if (!a) return Q(e, t, r.innerType, o);
    let c = U(t, a),
      u = A(t);
    return (
      e.write(`let ${u} = ${o};`),
      e.write(`if (${o} === undefined) ${u} = ${c}();`),
      Q(e, t, r.innerType, u)
    );
  }
  let s = A(t);
  if (a) {
    let c = U(t, a),
      u = U(t, Gr);
    (e.write(`let ${s};`),
      e.write(`if (${o} === undefined) {`),
      e.indented((l) => {
        l.write(`${s} = ${u}(${c}());`);
      }),
      e.write("} else {"),
      e.indented((l) => {
        let d = Q(l, t, r.innerType, o);
        l.write(`${s} = ${d} === undefined ? ${u}(${c}()) : ${d};`);
      }),
      e.write("}"));
  } else
    (e.write(`let ${s};`),
      e.write(`if (${o} !== undefined) {`),
      e.indented((c) => {
        let u = Q(c, t, r.innerType, o);
        c.write(`${s} = ${u};`);
      }),
      e.write("}"));
  return s;
}
function Bb(e, t, n, o) {
  let r = n._zod.def,
    i = Q(e, t, r.innerType, o),
    a = A(t);
  return (
    e.write(`const ${a} = ${i};`),
    e.write(`if (${a} === undefined) return INVALID;`),
    a
  );
}
function Kb(e, t, n, o) {
  let r = n._zod.def,
    i = r.items,
    a = r.rest;
  e.write(`if (!Array.isArray(${o})) return INVALID;`);
  let s = xg(i, "optin"),
    c = xg(i, "optout");
  a
    ? e.write(`if (${o}.length < ${s}) return INVALID;`)
    : e.write(
        `if (${o}.length < ${s} || ${o}.length > ${i.length}) return INVALID;`,
      );
  let u = A(t);
  e.write(`const ${u} = [];`);
  for (let l = 0; l < i.length; l++) {
    let d = i[l];
    if (l >= c)
      (e.write(`if (${u}.length === ${l}) {`),
        e.indented((f) => {
          (f.write(`if (${l} < ${o}.length) {`),
            f.indented((m) => {
              let v = A(t);
              m.write(`const ${v} = ${o}[${l}];`);
              let _ = ce(m, t, d, v);
              m.write(`${u}[${l}] = ${_};`);
            }),
            f.write("} else {"),
            f.indented((m) => {
              if (pc(d)) {
                m.write(`${u}.length = ${l};`);
                return;
              }
              let v = A(t),
                _ = A(t);
              (m.write(`const ${v} = undefined;`),
                m.write(`const ${_} = (() => {`),
                m.indented((S) => {
                  let T = ce(S, t, d, v);
                  S.write(`return ${T};`);
                }),
                m.write("})();"),
                m.write(
                  `if (${_} === INVALID || ${_} === undefined) ${u}.length = ${l};`,
                ),
                m.write(`else ${u}[${l}] = ${_};`));
            }),
            f.write("}"));
        }),
        e.write("}"));
    else {
      let f = A(t);
      e.write(`const ${f} = ${o}[${l}];`);
      let m = ce(e, t, d, f);
      e.write(`${u}[${l}] = ${m};`);
    }
  }
  if (a) {
    let l = A(t),
      d = A(t);
    (e.write(`for (let ${l} = ${i.length}; ${l} < ${o}.length; ${l}++) {`),
      e.indented((f) => {
        f.write(`const ${d} = ${o}[${l}];`);
        let m = ce(f, t, a, d);
        f.write(`${u}[${l}] = ${m};`);
      }),
      e.write("}"));
  }
  return u;
}
function xg(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (
      !(t === "optin"
        ? e[n]._zod.optin !== void 0
        : e[n]._zod.optout === "optional")
    )
      return n + 1;
  return 0;
}
function Wb(e, t, n, o) {
  let r = n._zod.def,
    i = r.options;
  if (r.discriminator) return Gb(e, t, r, o);
  if (r.inclusive === !1) throw new M("exclusive unions (z.xor)");
  if (i.length === 0) return (e.write("return INVALID;"), o);
  if (i.length === 1) return Q(e, t, i[0], o);
  if (
    i.every((c) => c._zod.def.type === "literal" && !c._zod.def.checks?.length)
  ) {
    let c = new Set(i.flatMap((l) => l._zod.def.values)),
      u = U(t, c);
    return (e.write(`if (!${u}.has(${o})) return INVALID;`), o);
  }
  let s = A(t);
  e.write(`let ${s};`);
  for (let c = 0; c < i.length; c++) {
    let u = i[c];
    (c === 0
      ? e.write(`${s} = (() => {`)
      : e.write(`if (${s} === INVALID) ${s} = (() => {`),
      e.indented((l) => {
        let d = Q(l, t, u, o);
        l.write(`return ${d};`);
      }),
      e.write("})();"));
  }
  return (e.write(`if (${s} === INVALID) return INVALID;`), s);
}
function Gb(e, t, n, o) {
  if (n.unionFallback) throw new M("discriminated union with unionFallback");
  if (n.options.length === 0) return (e.write("return INVALID;"), o);
  let r = A(t),
    i = A(t);
  (e.write(`const ${r} = ${o}?.[${de(n.discriminator)}];`),
    e.write(`let ${i};`));
  let a = !0,
    s = new Set();
  for (let c of n.options) {
    let u = c._zod.propValues?.[n.discriminator];
    if (!u || u.size === 0)
      throw new M(
        "discriminated union option without static discriminator values",
      );
    for (let f of u) {
      if (s.has(f)) throw new M(`duplicate discriminator value ${String(f)}`);
      s.add(f);
    }
    let l = Array.from(u, (f) => qb(t, r, f)),
      d = a ? "if" : "else if";
    (e.write(`${d} (${l.join(" || ")}) {`),
      e.indented((f) => {
        let m = Q(f, t, c, o);
        f.write(`${i} = ${m};`);
      }),
      e.write("}"),
      (a = !1));
  }
  return (e.write("else { return INVALID; }"), i);
}
function qb(e, t, n) {
  if (typeof n == "string") return `${t} === ${de(n)}`;
  if (typeof n == "number")
    return Number.isNaN(n) ? `Number.isNaN(${t})` : `${t} === ${n}`;
  if (typeof n == "boolean") return `${t} === ${n}`;
  if (n === null) return `${t} === null`;
  if (n === void 0) return `${t} === undefined`;
  if (typeof n == "bigint") return `${t} === ${n}n`;
  if (typeof n == "symbol") {
    let o = U(e, n);
    return `${t} === ${o}`;
  }
  throw new M(`literal discriminator value ${String(n)}`);
}
function Xb(e, t, n, o) {
  let r = n._zod.def;
  t.definite = !1;
  let i = ce(e, t, r.left, o),
    a = ce(e, t, r.right, o),
    s = U(t, er),
    c = A(t);
  return (
    e.write(`const ${c} = ${s}(${i}, ${a});`),
    e.write(`if (!${c}.valid) return INVALID;`),
    `${c}.data`
  );
}
function Hb(e, t, n, o) {
  let r = n._zod.def,
    i = U(t, Oe);
  e.write(`if (!${i}(${o})) return INVALID;`);
  let a = A(t),
    s = A(t),
    c = A(t);
  e.write(`const ${a} = {};`);
  let u = r,
    l = u.partial ? void 0 : r.keyType._zod.values;
  if (l) {
    let m = [];
    for (let _ of l) {
      if (!(
        typeof _ == "string" ||
        typeof _ == "number" ||
        typeof _ == "symbol"
      ))
        throw new M(`record key value ${String(_)}`);
      let S = typeof _ == "number" ? _.toString() : _;
      if (S === "__proto__") throw new M('record key "__proto__"');
      m.push(S);
      let T = U(t, _),
        j = Q(e, t, r.keyType, T),
        Z = A(t);
      e.write(`const ${Z} = ${o}[${Yb(t, S)}];`);
      let B = ce(e, t, r.valueType, Z);
      e.write(`${a}[${j}] = ${B};`);
    }
    let v = U(t, new Set(m));
    return (
      e.write(`for (const ${s} in ${o}) {`),
      e.indented((_) => {
        (_.write(`if (${v}.has(${s})) continue;`),
          u.mode === "loose"
            ? _.write(`if (${s} !== "__proto__") ${a}[${s}] = ${o}[${s}];`)
            : _.write("return INVALID;"));
      }),
      e.write("}"),
      a
    );
  }
  let d = r.keyType._zod.def;
  if (!(
    d.type === "string" &&
    d.format === void 0 &&
    !d.coerce &&
    (d.checks?.length ?? 0) === 0
  )) {
    let m = r.mode === "loose",
      v = co(r.keyType);
    v.definite === !1 && (t.definite = !1);
    let _ = U(t, v),
      S = U(t, qe),
      T = A(t);
    return (
      kg(e, t, o, s, (j) => {
        (j.write(`let ${T} = ${_}(${s});`),
          j.write(
            `if (${T} === INVALID && typeof ${s} === "string" && ${S}.test(${s})) ${T} = ${_}(Number(${s}));`,
          ),
          m
            ? j.write(
                `if (${T} === INVALID) { ${a}[${s}] = ${o}[${s}]; continue; }`,
              )
            : j.write(`if (${T} === INVALID) return INVALID;`),
          j.write(`if (${T} === "__proto__") continue;`));
        let Z = A(t);
        j.write(`const ${Z} = ${o}[${s}];`);
        let B = ce(j, t, r.valueType, Z);
        j.write(`${a}[${T}] = ${B};`);
      }),
      a
    );
  }
  return (
    kg(
      e,
      t,
      o,
      s,
      (m) => {
        m.write(`const ${c} = ${o}[${s}];`);
        let v = ce(m, t, r.valueType, c);
        m.write(`${a}[${s}] = ${v};`);
      },
      "return INVALID;",
    ),
    a
  );
}
function kg(e, t, n, o, r, i) {
  let a = U(t, Object.prototype.propertyIsEnumerable),
    s = A(t),
    c = A(t),
    u = A(t);
  (e.write(`const ${s} = Object.getOwnPropertySymbols(${n});`),
    e.write(`const ${c} = Object.getOwnPropertyNames(${n});`),
    e.write(`for (let ${u} = 0; ${u} < ${c}.length; ${u}++) {`),
    e.indented((l) => {
      (l.write(`const ${o} = ${c}[${u}];`),
        l.write(
          `if (${o} === "__proto__" || !${a}.call(${n}, ${o})) continue;`,
        ),
        r(l));
    }),
    e.write("}"),
    e.write(`for (let ${u} = 0; ${u} < ${s}.length; ${u}++) {`),
    e.indented((l) => {
      (l.write(`const ${o} = ${s}[${u}];`),
        l.write(`if (!${a}.call(${n}, ${o})) continue;`),
        i ? l.write(i) : r(l));
    }),
    e.write("}"));
}
function Yb(e, t) {
  return typeof t == "string" ? de(t) : U(e, t);
}
function Qb(e, t, n, o) {
  let r = n._zod.def;
  (e.write(`if (!(${o} instanceof Map)) return INVALID;`),
    hc(e, n, `${o}.size`));
  let i = A(t),
    a = A(t),
    s = A(t);
  return (
    e.write(`const ${i} = new Map();`),
    e.write(`for (const [${a}, ${s}] of ${o}) {`),
    e.indented((c) => {
      let u = Q(c, t, r.keyType, a),
        l = Q(c, t, r.valueType, s);
      c.write(`${i}.set(${u}, ${l});`);
    }),
    e.write("}"),
    i
  );
}
function ex(e, t, n, o) {
  let r = n._zod.def;
  (e.write(`if (!(${o} instanceof Set)) return INVALID;`),
    hc(e, n, `${o}.size`));
  let i = A(t),
    a = A(t);
  return (
    e.write(`const ${i} = new Set();`),
    e.write(`for (const ${a} of ${o}) {`),
    e.indented((s) => {
      let c = Q(s, t, r.valueType, a);
      s.write(`${i}.add(${c});`);
    }),
    e.write("}"),
    i
  );
}
function tx(e, t) {
  return (e.write(`if (!(${t} instanceof File)) return INVALID;`), t);
}
function rx(e, t, n, o) {
  e.write(`if (typeof ${o} !== "string") return INVALID;`);
  let r = n._zod.pattern;
  if (r) {
    let i = U(t, r);
    (e.write(`${i}.lastIndex = 0;`),
      e.write(`if (!${i}.test(${o})) return INVALID;`));
  }
  return o;
}
function nx(e, t, n, o) {
  let r = n._zod.def,
    i = St(t, r.getter),
    a = U(t, { parser: null });
  (e.write(`if (!${a}.parser) {`),
    e.indented((c) => {
      (c.write(`const inner = ${i}();`),
        c.write(`${a}.parser = function(input) {`),
        c.indented((u) => {
          (u.write(
            "const result = inner._zod.run({ value: input, issues: [] }, {});",
          ),
            u.write(
              "return result.issues.length === 0 ? result.value : INVALID;",
            ));
        }),
        c.write("};"));
    }),
    e.write("}"));
  let s = A(t);
  return (
    e.write(`const ${s} = ${a}.parser(${o});`),
    e.write(`if (${s} === INVALID) return INVALID;`),
    s
  );
}
function ix(e, t, n, o) {
  let r = n._zod.def,
    i = Q(e, t, r.in, o);
  if (r.transform) {
    if (zt(r.transform))
      throw new De("z.compile: async transforms in pipes are not supported");
    let a = r.transform,
      c = St(t, (l) => {
        let d = { value: l, issues: [], addIssue: vc },
          f = a(l, d);
        return f instanceof Promise ? me : d.issues.length === 0 ? f : me;
      }),
      u = A(t);
    return (
      e.write(`const ${u} = ${c}(${i});`),
      e.write(`if (${u} === INVALID) return INVALID;`),
      Q(e, t, r.out, u)
    );
  } else return Q(e, t, r.out, i);
}
function zt(e) {
  return (
    typeof e == "function" &&
    (e.constructor.name === "AsyncFunction" ||
      e[Symbol.toStringTag] === "AsyncFunction")
  );
}
function ox(e, t, n, o) {
  let r = n._zod.def;
  if (r.fn) {
    if (zt(r.fn))
      throw new De("z.compile: async custom predicates are not supported");
    let i = St(t, r.fn),
      a = U(t, mc),
      s = A(t);
    (e.write(`const ${s} = ${i}(${o});`),
      e.write(`if (${s} instanceof Promise) ${a}();`),
      e.write(`if (!${s}) return INVALID;`));
  } else throw new M("custom schema without a predicate function");
  return o;
}
function ax(e, t, n) {
  let o = e._zod.run({ value: n, issues: [] }, {});
  if (o && typeof o.then == "function") return me;
  let r = o;
  return r.issues.length === 0 ? r.value : t();
}
function sx(e, t, n, o) {
  let r = n._zod.def;
  if (!r.catchValue[pi])
    throw new M(
      "catch with a callback (only a constant catch value compiles)",
      !1,
    );
  let i = A(t);
  (e.write(`let ${i} = (() => {`),
    e.indented((u) => {
      let l = ce(u, t, r.innerType, o);
      u.write(`return ${l};`);
    }),
    e.write("})();"));
  let a = U(t, r.innerType),
    s = St(t, r.catchValue),
    c = U(t, ax);
  return (
    e.write(`if (${i} === INVALID) {`),
    e.indented((u) => {
      (u.write(`${i} = ${c}(${a}, ${s}, ${o});`),
        u.write(`if (${i} === INVALID) return INVALID;`));
    }),
    e.write("}"),
    i
  );
}
function ux(e, t, n, o) {
  let r = n._zod.def;
  if (r.transform) {
    if (zt(r.transform))
      throw new De("z.compile: async transforms are not supported");
    let i = r.transform,
      s = St(t, (u) => {
        let l = { value: u, issues: [], addIssue: vc },
          d = i(u, l);
        return d instanceof Promise ? me : l.issues.length === 0 ? d : me;
      }),
      c = A(t);
    return (
      e.write(`const ${c} = ${s}(${o});`),
      e.write(`if (${c} === INVALID) return INVALID;`),
      c
    );
  }
  return o;
}
function lo(e) {
  return (e.checks && (e.checks = [...e.checks]), e);
}
function yc(e, t) {
  return new e(lo({ type: "string", ...k(t) }));
}
function $c(e, t) {
  return new e(lo({ type: "string", coerce: !0, ...k(t) }));
}
function fo(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function mo(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function po(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function go(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...k(t),
  });
}
function vo(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...k(t),
  });
}
function ho(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...k(t),
  });
}
function In(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function yo(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function $o(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function _o(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function bo(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function xo(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function ko(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function wo(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function Io(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function So(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function _c(e, t) {
  return new e({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function zo(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function Po(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function Oo(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function jo(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function No(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function bc(e, t) {
  return new e({
    type: "string",
    format: "credit_card",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function xc(e, t) {
  return new e({
    type: "string",
    format: "iban",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
function To(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...k(t),
  });
}
var kc = { Any: null, Minute: -1, Second: 0, Millisecond: 3, Microsecond: 6 };
function Sn(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...k(t),
  });
}
function zn(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...k(t),
  });
}
function Pn(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...k(t),
  });
}
function On(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...k(t),
  });
}
function wc(e, t) {
  return new e(lo({ type: "number", checks: [], ...k(t) }));
}
function Ic(e, t) {
  return new e(lo({ type: "number", coerce: !0, checks: [], ...k(t) }));
}
function Sc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...k(t),
  });
}
function zc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...k(t),
  });
}
function Pc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...k(t),
  });
}
function Oc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...k(t),
  });
}
function jc(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...k(t),
  });
}
function Nc(e, t) {
  return new e({ type: "boolean", ...k(t) });
}
function Tc(e, t) {
  return new e({ type: "boolean", coerce: !0, ...k(t) });
}
function Ac(e, t) {
  return new e({ type: "bigint", ...k(t) });
}
function Dc(e, t) {
  return new e({ type: "bigint", coerce: !0, ...k(t) });
}
function Uc(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...k(t),
  });
}
function Ec(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...k(t),
  });
}
function Zc(e, t) {
  return new e({ type: "symbol", ...k(t) });
}
function Cc(e, t) {
  return new e({ type: "undefined", ...k(t) });
}
function Lc(e, t) {
  return new e({ type: "null", ...k(t) });
}
function Rc(e) {
  return new e({ type: "any" });
}
function Vc(e) {
  return new e({ type: "unknown" });
}
function Fc(e, t) {
  return new e({ type: "never", ...k(t) });
}
function Mc(e, t) {
  return new e({ type: "void", ...k(t) });
}
function Jc(e, t) {
  return new e({ type: "date", ...k(t) });
}
function Bc(e, t) {
  return new e({ type: "date", coerce: !0, ...k(t) });
}
function Kc(e, t) {
  return new e({ type: "nan", ...k(t) });
}
function Re(e, t) {
  return new ji({ check: "less_than", ...k(t), value: e, inclusive: !1 });
}
function ke(e, t) {
  return new ji({ check: "less_than", ...k(t), value: e, inclusive: !0 });
}
function Ve(e, t) {
  return new Ni({ check: "greater_than", ...k(t), value: e, inclusive: !1 });
}
function we(e, t) {
  return new Ni({ check: "greater_than", ...k(t), value: e, inclusive: !0 });
}
function Ao(e) {
  return Ve(0, e);
}
function Do(e) {
  return Re(0, e);
}
function Uo(e) {
  return ke(0, e);
}
function Eo(e) {
  return we(0, e);
}
function st(e, t) {
  return new Ps({ check: "multiple_of", ...k(t), value: e });
}
function ut(e, t) {
  return new Ns({ check: "max_size", ...k(t), maximum: e });
}
function Fe(e, t) {
  return new Ts({ check: "min_size", ...k(t), minimum: e });
}
function Pt(e, t) {
  return new As({ check: "size_equals", ...k(t), size: e });
}
function Ot(e, t) {
  return new Ds({ check: "max_length", ...k(t), maximum: e });
}
function Xe(e, t) {
  return new Us({ check: "min_length", ...k(t), minimum: e });
}
function jt(e, t) {
  return new Es({ check: "length_equals", ...k(t), length: e });
}
function ir(e, t) {
  return new Zs({
    check: "string_format",
    format: "regex",
    ...k(t),
    pattern: e,
  });
}
function or(e) {
  return new Cs({ check: "string_format", format: "lowercase", ...k(e) });
}
function ar(e) {
  return new Ls({ check: "string_format", format: "uppercase", ...k(e) });
}
function sr(e, t) {
  return new Rs({
    check: "string_format",
    format: "includes",
    ...k(t),
    includes: e,
  });
}
function ur(e, t) {
  return new Vs({
    check: "string_format",
    format: "starts_with",
    ...k(t),
    prefix: e,
  });
}
function cr(e, t) {
  return new Fs({
    check: "string_format",
    format: "ends_with",
    ...k(t),
    suffix: e,
  });
}
function Zo(e, t, n) {
  return new Ms({ check: "property", property: e, schema: t, ...k(n) });
}
function lr(e, t) {
  return new Js({ check: "properties", shape: e, ...k(t) });
}
function dr(e, t) {
  return new Bs({ check: "mime_type", mime: e, ...k(t) });
}
function Ue(e) {
  return new Ks({ check: "overwrite", tx: e });
}
function fr(e) {
  return Ue((t) => t.normalize(e));
}
function mr() {
  return Ue((e) => e.trim());
}
function pr() {
  return Ue((e) => e.toLowerCase());
}
function gr() {
  return Ue((e) => e.toUpperCase());
}
function vr() {
  return Ue((e) => ja(e));
}
function Wc(e, t, n) {
  return new e({ type: "array", element: t, ...k(n) });
}
function cx(e, t, n) {
  return new e({ type: "union", options: t, ...k(n) });
}
function lx(e, t, n) {
  return new e({ type: "union", options: t, inclusive: !1, ...k(n) });
}
function dx(e, t, n, o) {
  return new e({ type: "union", options: n, discriminator: t, ...k(o) });
}
function fx(e, t, n) {
  return new e({ type: "intersection", left: t, right: n });
}
function mx(e, t, n, o) {
  let r = n instanceof C,
    i = r ? o : n,
    a = r ? n : null;
  return new e({ type: "tuple", items: t, rest: a, ...k(i) });
}
function px(e, t, n, o) {
  return new e({ type: "record", keyType: t, valueType: n, ...k(o) });
}
function gx(e, t, n, o) {
  return new e({ type: "map", keyType: t, valueType: n, ...k(o) });
}
function vx(e, t, n) {
  return new e({ type: "set", valueType: t, ...k(n) });
}
function hx(e, t, n) {
  let o = Array.isArray(t) ? Object.fromEntries(t.map((r) => [r, r])) : t;
  return new e({ type: "enum", entries: o, ...k(n) });
}
function yx(e, t, n) {
  return new e({ type: "enum", entries: t, ...k(n) });
}
function $x(e, t, n) {
  return new e({
    type: "literal",
    values: Array.isArray(t) ? t : [t],
    ...k(n),
  });
}
function Gc(e, t) {
  return new e({ type: "file", ...k(t) });
}
function _x(e, t) {
  return new e({ type: "transform", transform: t });
}
function bx(e, t) {
  return new e({ type: "optional", innerType: t });
}
function xx(e, t) {
  return new e({ type: "nullable", innerType: t });
}
function kx(e, t, n) {
  return new e({
    type: "default",
    innerType: t,
    get defaultValue() {
      return typeof n == "function" ? n() : Gr(n);
    },
  });
}
function wx(e, t, n) {
  return new e({ type: "nonoptional", innerType: t, ...k(n) });
}
function Ix(e, t) {
  return new e({ type: "success", innerType: t });
}
function Sx(e, t, n) {
  return new e({
    type: "catch",
    innerType: t,
    catchValue: typeof n == "function" ? n : Ea(n),
  });
}
function zx(e, t, n) {
  return new e({ type: "pipe", in: t, out: n });
}
function Px(e, t) {
  return new e({ type: "readonly", innerType: t });
}
function Ox(e, t, n) {
  return new e({ type: "template_literal", parts: t, ...k(n) });
}
function jx(e, t) {
  return new e({ type: "lazy", getter: t });
}
function Nx(e, t) {
  return new e({ type: "promise", innerType: t });
}
function qc(e, t, n) {
  let o = k(n);
  return (
    o.abort ?? (o.abort = !0),
    new e({ type: "custom", check: "custom", fn: t, ...o })
  );
}
function Xc(e, t, n) {
  return new e({ type: "custom", check: "custom", fn: t, ...k(n) });
}
function Hc(e, t) {
  let n = zg(
    (o) => (
      (o.addIssue = (r) => {
        if (typeof r == "string") o.issues.push(Gt(r, o.value, n._zod.def));
        else {
          let i = r;
          (i.fatal && (i.continue = !1),
            i.code ?? (i.code = "custom"),
            "input" in i || (i.input = o.value),
            i.inst ?? (i.inst = n),
            i.continue ?? (i.continue = !n._zod.def.abort),
            o.issues.push(Gt(i)));
        }
      }),
      e(o.value, o)
    ),
    t,
  );
  return n;
}
function zg(e, t) {
  let n = new Y({ check: "custom", ...k(t) });
  return ((n._zod.check = e), n);
}
function Yc(e) {
  let t = new Y({ check: "describe" });
  return (
    (t._zod.onattach = [
      (n) => {
        let o = ue.get(n) ?? {};
        ue.add(n, { ...o, description: e });
      },
    ]),
    (t._zod.check = () => {}),
    t
  );
}
function Qc(e) {
  let t = new Y({ check: "meta" });
  return (
    (t._zod.onattach = [
      (n) => {
        let o = ue.get(n) ?? {};
        ue.add(n, { ...o, ...e });
      },
    ]),
    (t._zod.check = () => {}),
    t
  );
}
function el(e, t) {
  let n = k(t),
    o = n.truthy ?? ["true", "1", "yes", "on", "y", "enabled"],
    r = n.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  n.case !== "sensitive" &&
    ((o = o.map((m) => (typeof m == "string" ? m.toLowerCase() : m))),
    (r = r.map((m) => (typeof m == "string" ? m.toLowerCase() : m))));
  let i = new Set(o),
    a = new Set(r),
    s = e.Codec ?? yn,
    c = e.Boolean ?? vn,
    u = e.String ?? wt,
    l = new u({ type: "string", error: n.error }),
    d = new c({ type: "boolean", error: n.error }),
    f = new s({
      type: "pipe",
      in: l,
      out: d,
      transform: (m, v) => {
        let _ = m;
        return (
          n.case !== "sensitive" && (_ = _.toLowerCase()),
          i.has(_)
            ? !0
            : a.has(_)
              ? !1
              : (v.issues.push({
                  code: "invalid_value",
                  expected: "stringbool",
                  values: [...i, ...a],
                  input: v.value,
                  inst: f,
                  continue: !1,
                }),
                {})
        );
      },
      reverseTransform: (m, v) => (m === !0 ? o[0] || "true" : r[0] || "false"),
      error: n.error,
    });
  return (
    (f._zod.bag.truthy = o),
    (f._zod.bag.falsy = r),
    (f._zod.bag.case = n.case ?? "insensitive"),
    f
  );
}
function Nt(e, t, n, o = {}) {
  let r = k(o),
    i = {
      check: "string_format",
      type: "string",
      format: t,
      fn: typeof n == "function" ? n : (s) => n.test(s),
      ...r,
    };
  return (n instanceof RegExp && (i.pattern = n), new e(i));
}
function jn(e, ...t) {
  for (let n of t)
    for (let o of Reflect.ownKeys(n))
      Object.prototype.propertyIsEnumerable.call(n, o) && se(e, o, n[o]);
  return e;
}
function ct(e) {
  let t = e?.target ?? "draft-2020-12";
  return (
    t === "draft-4" && (t = "draft-04"),
    t === "draft-7" && (t = "draft-07"),
    {
      processors: e.processors ?? {},
      metadataRegistry: e?.metadata ?? ue,
      target: t,
      unrepresentable: e?.unrepresentable ?? "throw",
      override: e?.override ?? (() => {}),
      io: e?.io ?? "output",
      counter: 0,
      seen: new Map(),
      sharedDefsExtractedFor: void 0,
      sharedEmitDoneFor: void 0,
      cycles: e?.cycles ?? "ref",
      reused: e?.reused ?? "inline",
      intersections: [],
      deferred: [],
      external: e?.external ?? void 0,
    }
  );
}
function ne(e, t, n, o, r) {
  let i =
    typeof t.unrepresentable == "function"
      ? t.unrepresentable({ zodSchema: e, path: o.path, message: r })
      : t.unrepresentable;
  if (i === "any") return !1;
  if (i === void 0 || i === "throw") throw new Error(r);
  return (Object.assign(n, i), !0);
}
function q(e, t, n = { path: [], schemaPath: [] }) {
  var o;
  let r = e._zod.def,
    i = t.seen.get(e);
  if (i)
    return (
      i.count++,
      n.schemaPath.includes(e) && (i.cycle = n.path),
      i.schema
    );
  let a = { schema: {}, count: 1, cycle: void 0, path: n.path };
  (t.seen.set(e, a),
    (t.sharedDefsExtractedFor = void 0),
    (t.sharedEmitDoneFor = void 0));
  let s = e._zod.toJSONSchema?.();
  if (s) a.schema = s;
  else {
    let l = { ...n, schemaPath: [...n.schemaPath, e], path: n.path };
    if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, a.schema, l);
    else {
      let f = a.schema,
        m = t.processors[r.type];
      if (!m)
        throw new Error(
          `[toJSONSchema]: Non-representable type encountered: ${r.type}`,
        );
      m(e, t, f, l);
    }
    let d = e._zod.parent;
    d && (a.ref || (a.ref = d), q(d, t, l), (t.seen.get(d).isParent = !0));
  }
  let c = t.metadataRegistry.get(e);
  return (
    c && jn(a.schema, c),
    t.io === "input" &&
      pe(e) &&
      (delete a.schema.examples, delete a.schema.default),
    t.io === "input" &&
      "_prefault" in a.schema &&
      ((o = a.schema).default ?? (o.default = a.schema._prefault)),
    delete a.schema._prefault,
    t.seen.get(e).schema
  );
}
function Pg(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function lt(e, t) {
  let n = e.seen.get(t);
  if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (e.external && e.sharedDefsExtractedFor === e.external) return;
  let o = new Map();
  for (let a of e.seen.entries()) {
    let s = e.metadataRegistry.get(a[0])?.id;
    if (s) {
      let c = o.get(s);
      if (c && c !== a[0])
        throw new Error(
          `Duplicate schema id "${s}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`,
        );
      o.set(s, a[0]);
    }
  }
  let r = (a) => {
      let s = e.target === "draft-2020-12" ? "$defs" : "definitions";
      if (e.external) {
        let d = e.external.registry.get(a[0])?.id,
          f = e.external.uri ?? ((v) => v);
        if (d) return { ref: f(d) };
        let m = a[1].defId ?? a[1].schema.id ?? `schema${e.counter++}`;
        return (
          (a[1].defId = m),
          { defId: m, ref: `${f("__shared")}#/${s}/${Pg(m)}` }
        );
      }
      let c = "#",
        u = `${c}/${s}/`;
      if (a[1] === n && !a[1].schema.id) return { ref: c };
      let l = a[1].schema.id ?? `__schema${e.counter++}`;
      return { defId: l, ref: u + Pg(l) };
    },
    i = (a) => {
      if (a[1].schema.$ref) return;
      let s = a[1],
        { ref: c, defId: u } = r(a);
      ((s.def = { ...s.schema }), u && (s.defId = u));
      let l = s.schema;
      for (let d in l) delete l[d];
      l.$ref = c;
    };
  if (e.cycles === "throw")
    for (let a of e.seen.entries()) {
      let s = a[1];
      if (s.cycle)
        throw new Error(`Cycle detected: #/${s.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let a of e.seen.entries()) {
    let s = a[1];
    if (t === a[0]) {
      i(a);
      continue;
    }
    if (e.external) {
      let u = e.external.registry.get(a[0])?.id;
      if (t !== a[0] && u) {
        i(a);
        continue;
      }
    }
    if (e.metadataRegistry.get(a[0])?.id) {
      i(a);
      continue;
    }
    if (s.cycle) {
      i(a);
      continue;
    }
    s.count > 1 && e.reused === "ref" && i(a);
  }
  e.external && (e.sharedDefsExtractedFor = e.external);
}
function Ng(e) {
  let t = e.anyOf;
  if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
  let n = [];
  for (let o of t) {
    if (!o || typeof o != "object") return;
    Ng(o);
    let r = Object.keys(o);
    if (r.length !== 1 || r[0] !== "type") return;
    let i = o.type;
    for (let a of Array.isArray(i) ? i : [i]) {
      if (typeof a != "string") return;
      n.includes(a) || n.push(a);
    }
  }
  (delete e.anyOf, (e.type = n.length === 1 ? n[0] : n));
}
var Tg = new Set(["type", "properties", "required", "additionalProperties"]),
  Og = ["oneOf", "anyOf"];
function jg(e) {
  let t = e.additionalProperties;
  return t === void 0 || t === !1 || typeof t != "object" || t === null
    ? null
    : Object.keys(t).length
      ? t
      : null;
}
function tl(e) {
  let t = [];
  for (let i of e) {
    if (typeof i != "object" || i.type !== "object") return null;
    for (let a in i) if (!Tg.has(a)) return null;
    t.push(i);
  }
  let n = {},
    o = new Set();
  for (let i of t) {
    for (let a in i.properties) {
      if (Object.prototype.hasOwnProperty.call(n, a)) continue;
      let s = [];
      for (let u of t) {
        let l = u.properties?.[a] ?? jg(u);
        l != null &&
          (s.some((d) => JSON.stringify(d) === JSON.stringify(l)) || s.push(l));
      }
      let c = s.length === 1 ? s[0] : (tl(s) ?? { allOf: s });
      se(n, a, c);
    }
    for (let a of i.required ?? []) o.add(a);
  }
  let r = { type: "object", properties: n };
  if (
    (o.size && (r.required = [...o]),
    t.every((i) => i.additionalProperties === !1))
  )
    r.additionalProperties = !1;
  else {
    let i = [];
    for (let a of t) {
      let s = jg(a);
      s && !i.some((c) => JSON.stringify(c) === JSON.stringify(s)) && i.push(s);
    }
    i.length === 1
      ? (r.additionalProperties = i[0])
      : i.length > 1 && (r.additionalProperties = { allOf: i });
  }
  return r;
}
function Tx(e) {
  let t = e.allOf;
  if (!Array.isArray(t) || t.length < 2) return;
  for (let r of Tg) if (r in e) return;
  let n = t.filter((r) => Og.some((i) => Array.isArray(r[i]))),
    o = null;
  if (!n.length) o = tl(t);
  else {
    let r = n[0],
      i = Og.find((c) => Array.isArray(r[c]));
    if (Object.keys(r).length !== 1) return;
    let a = t.filter((c) => c !== r),
      s = r[i].map((c) => tl([...a, c]));
    if (s.some((c) => !c)) return;
    o = { [i]: s };
  }
  o && (delete e.allOf, jn(e, o));
}
function dt(e, t) {
  let n = e.seen.get(t);
  if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
  let o = (s) => {
    let c = e.seen.get(s);
    if (c.ref === null) return;
    let u = c.def ?? c.schema,
      l = { ...u },
      d = c.ref;
    if (((c.ref = null), d)) {
      o(d);
      let m = e.seen.get(d),
        v = m.schema;
      if (
        (v.$ref &&
        (e.target === "draft-07" ||
          e.target === "draft-04" ||
          e.target === "openapi-3.0")
          ? ((u.allOf = u.allOf ?? []), u.allOf.push(v))
          : jn(u, v),
        jn(u, l),
        s._zod.parent === d)
      )
        for (let S in u) S === "$ref" || S === "allOf" || S in l || delete u[S];
      if (v.$ref && m.def)
        for (let S in u)
          S === "$ref" ||
            S === "allOf" ||
            (S in m.def &&
              JSON.stringify(u[S]) === JSON.stringify(m.def[S]) &&
              delete u[S]);
    }
    let f = s._zod.parent;
    if (f && f !== d) {
      o(f);
      let m = e.seen.get(f);
      if (m?.schema.$ref && ((u.$ref = m.schema.$ref), m.def))
        for (let v in u)
          v === "$ref" ||
            v === "allOf" ||
            (v in m.def &&
              JSON.stringify(u[v]) === JSON.stringify(m.def[v]) &&
              delete u[v]);
    }
    e.override({ zodSchema: s, jsonSchema: u, path: c.path ?? [] });
  };
  if (!e.external || e.sharedEmitDoneFor !== e.external) {
    for (let s of [...e.seen.entries()].reverse()) o(s[0]);
    if (e.target !== "openapi-3.0")
      for (let s of e.seen.entries()) Ng(s[1].def ?? s[1].schema);
    for (let s of e.deferred) s();
    if (e.intersections.length) {
      let s = new Map();
      for (let c of e.seen.values())
        for (let u of [c.schema, c.def]) {
          let l = u?.allOf;
          if (!Array.isArray(l)) continue;
          let d = s.get(l);
          d ? d.push(u) : s.set(l, [u]);
        }
      for (let c of e.intersections) for (let u of s.get(c) ?? []) Tx(u);
    }
  }
  let r = {};
  if (
    (e.target === "draft-2020-12"
      ? (r.$schema = "https://json-schema.org/draft/2020-12/schema")
      : e.target === "draft-07"
        ? (r.$schema = "http://json-schema.org/draft-07/schema#")
        : e.target === "draft-04"
          ? (r.$schema = "http://json-schema.org/draft-04/schema#")
          : e.target,
    e.external?.uri)
  ) {
    let s = e.external.registry.get(t)?.id;
    if (!s) throw new Error("Schema is missing an `id` property");
    r.$id = e.external.uri(s);
  }
  jn(r, n.defId ? n.schema : (n.def ?? n.schema));
  let i = e.metadataRegistry.get(t)?.id;
  i !== void 0 && r.id === i && delete r.id;
  let a = e.external?.defs ?? {};
  if (!e.external || e.sharedEmitDoneFor !== e.external)
    for (let s of e.seen.entries()) {
      let c = s[1];
      c.def &&
        c.defId &&
        (c.def.id === c.defId && delete c.def.id, se(a, c.defId, c.def));
    }
  (e.external && (e.sharedEmitDoneFor = e.external),
    e.external ||
      (Object.keys(a).length > 0 &&
        (e.target === "draft-2020-12" ? (r.$defs = a) : (r.definitions = a))));
  try {
    let s = JSON.parse(JSON.stringify(r));
    return (
      Object.defineProperty(s, "~standard", {
        value: {
          ...t["~standard"],
          jsonSchema: {
            input: hr(t, "input", e.processors),
            output: hr(t, "output", e.processors),
          },
        },
        enumerable: !1,
        writable: !1,
      }),
      s
    );
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function pe(e, t) {
  let n = t ?? { seen: new Set() };
  if (n.seen.has(e)) return !1;
  n.seen.add(e);
  let o = e._zod.def;
  if (o.type === "transform") return !0;
  if (o.type === "array") return pe(o.element, n);
  if (o.type === "set") return pe(o.valueType, n);
  if (o.type === "lazy") return pe(o.getter(), n);
  if (
    o.type === "promise" ||
    o.type === "optional" ||
    o.type === "nonoptional" ||
    o.type === "nullable" ||
    o.type === "readonly" ||
    o.type === "default" ||
    o.type === "prefault" ||
    o.type === "catch"
  )
    return pe(o.innerType, n);
  if (o.type === "intersection") return pe(o.left, n) || pe(o.right, n);
  if (o.type === "record" || o.type === "map")
    return pe(o.keyType, n) || pe(o.valueType, n);
  if (o.type === "pipe")
    return e._zod.traits.has("$ZodCodec") ? !0 : pe(o.in, n) || pe(o.out, n);
  if (o.type === "object") {
    for (let r in o.shape) if (pe(o.shape[r], n)) return !0;
    return !1;
  }
  if (o.type === "union") {
    for (let r of o.options) if (pe(r, n)) return !0;
    return !1;
  }
  if (o.type === "tuple") {
    for (let r of o.items) if (pe(r, n)) return !0;
    return !!(o.rest && pe(o.rest, n));
  }
  return !1;
}
var rl =
    (e, t = {}) =>
    (n) => {
      let o = ct({ ...n, processors: t });
      return (q(e, o), lt(o, e), dt(o, e));
    },
  hr =
    (e, t, n = {}) =>
    (o) => {
      let { libraryOptions: r, target: i } = o ?? {},
        a = ct({ ...(r ?? {}), target: i, io: t, processors: n });
      return (q(e, a), lt(a, e), dt(a, e));
    };
var yr = (e, t, n) => {
    (e[t] === void 0 || n > e[t]) && (e[t] = n);
  },
  $r = (e, t, n) => {
    (e[t] === void 0 || n < e[t]) && (e[t] = n);
  },
  Ag = (e, t) => {
    (yr(e, "minimum", t), $r(e, "maximum", t));
  },
  Zg = (e, t) => {
    (e.multipleOf ?? (e.multipleOf = []),
      e.multipleOf.includes(t) || e.multipleOf.push(t));
  },
  Cg = (e, t) => {
    (e.patterns ?? (e.patterns = new Set()), e.patterns.add(t));
  },
  Lg = (e, t) => {
    e.mime = e.mime ? e.mime.filter((n) => t.includes(n)) : [...t];
  },
  Rg = (e, t) => {
    ((e.format = t), t.includes("int") && (e.isInt = !0));
  },
  Dg = (e, t) => yr(e, "minimum", t.minimum),
  Ug = (e, t) => $r(e, "maximum", t.maximum),
  Eg = (e) => (t, n) => {
    Rg(t, n.format);
    let [o, r] = e[n.format];
    (yr(t, "minimum", o), $r(t, "maximum", r));
  },
  Ax = {
    greater_than: (e, t) =>
      yr(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
    less_than: (e, t) =>
      $r(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
    multiple_of: (e, t) => Zg(e, t.value),
    number_format: Eg(Xr),
    bigint_format: Eg(Hr),
    min_length: Dg,
    max_length: Ug,
    length_equals: (e, t) => Ag(e, t.length),
    min_size: Dg,
    max_size: Ug,
    size_equals: (e, t) => Ag(e, t.size),
    string_format: (e, t) => {
      (Rg(e, t.format),
        t.pattern && Cg(e, t.pattern),
        (t.format === "base64" || t.format === "base64url") &&
          (e.contentEncoding = t.format),
        (t.local || t.precision === -1) && (e.laxFormat = !0));
    },
    mime_type: (e, t) => Lg(e, t.mime),
  };
function ie(e) {
  let t = {},
    n = e._zod.def,
    o = e._zod.traits.has("$ZodCheck")
      ? [e, ...(n.checks ?? [])]
      : (n.checks ?? []);
  for (let i of o) Ax[i._zod.def.check]?.(t, i._zod.def);
  let r = e._zod.bag;
  (r.minimum !== void 0 && yr(t, "minimum", r.minimum),
    r.exclusiveMinimum !== void 0 &&
      yr(t, "exclusiveMinimum", r.exclusiveMinimum),
    r.maximum !== void 0 && $r(t, "maximum", r.maximum),
    r.exclusiveMaximum !== void 0 &&
      $r(t, "exclusiveMaximum", r.exclusiveMaximum),
    r.multipleOf !== void 0 && Zg(t, r.multipleOf),
    r.format !== void 0 &&
      (t.format ?? (t.format = r.format),
      r.format.includes("int") && (t.isInt = !0)),
    r.mime && Lg(t, r.mime));
  for (let i of r.patterns ?? []) Cg(t, i);
  return t;
}
var Dx = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: "",
  },
  Ux = new Map([
    [Vi, us],
    [gn, cs],
  ]),
  Vg = (e) => Ux.get(e) ?? e,
  ol = (e, t, n, o) => {
    let r = n;
    r.type = "string";
    let {
      minimum: i,
      maximum: a,
      format: s,
      patterns: c,
      contentEncoding: u,
      laxFormat: l,
    } = ie(e);
    if (
      (typeof i == "number" && (r.minLength = i),
      typeof a == "number" && (r.maxLength = a),
      s &&
        ((r.format = Dx[s] ?? s),
        r.format === "" && delete r.format,
        (s === "time" || l) && delete r.format),
      u && (r.contentEncoding = u),
      c && c.size > 0)
    ) {
      let d = [...c].map(Vg);
      d.length === 1
        ? (r.pattern = d[0].source)
        : d.length > 1 &&
          (r.allOf = [
            ...d.map((f) => ({
              ...(t.target === "draft-07" ||
              t.target === "draft-04" ||
              t.target === "openapi-3.0"
                ? { type: "string" }
                : {}),
              pattern: f.source,
            })),
          ]);
    }
  },
  al = (e, t, n, o) => {
    let r = n,
      {
        minimum: i,
        maximum: a,
        multipleOf: s,
        exclusiveMaximum: c,
        exclusiveMinimum: u,
        isInt: l,
      } = ie(e);
    r.type = l ? "integer" : "number";
    let d = typeof u == "number" && u >= (i ?? Number.NEGATIVE_INFINITY),
      f = typeof c == "number" && c <= (a ?? Number.POSITIVE_INFINITY),
      m = t.target === "draft-04" || t.target === "openapi-3.0";
    if (
      (d
        ? m
          ? ((r.minimum = u), (r.exclusiveMinimum = !0))
          : (r.exclusiveMinimum = u)
        : typeof i == "number" && (r.minimum = i),
      f
        ? m
          ? ((r.maximum = c), (r.exclusiveMaximum = !0))
          : (r.exclusiveMaximum = c)
        : typeof a == "number" && (r.maximum = a),
      s)
    ) {
      let v = new Set();
      for (let T of s)
        Number.isFinite(T) && T !== 0
          ? v.add(Math.abs(T))
          : ne(
              e,
              t,
              r,
              o,
              `A multipleOf divisor of ${T} cannot be represented in JSON Schema`,
            );
      let [_, ...S] = v;
      (_ !== void 0 && (r.multipleOf = _),
        S.length &&
          (r.allOf = [
            ...(r.allOf ?? []),
            ...S.map((T) => ({ multipleOf: T })),
          ]));
    }
  },
  sl = (e, t, n, o) => {
    n.type = "boolean";
  },
  ul = (e, t, n, o) => {
    ne(e, t, n, o, "BigInt cannot be represented in JSON Schema");
  },
  cl = (e, t, n, o) => {
    ne(e, t, n, o, "Symbols cannot be represented in JSON Schema");
  },
  ll = (e, t, n, o) => {
    t.target === "openapi-3.0"
      ? ((n.type = "string"), (n.nullable = !0), (n.enum = [null]))
      : (n.type = "null");
  },
  dl = (e, t, n, o) => {
    ne(e, t, n, o, "Undefined cannot be represented in JSON Schema");
  },
  fl = (e, t, n, o) => {
    ne(e, t, n, o, "Void cannot be represented in JSON Schema");
  },
  ml = (e, t, n, o) => {
    n.not = {};
  },
  pl = (e, t, n, o) => {},
  gl = (e, t, n, o) => {},
  vl = (e, t, n, o) => {
    ne(e, t, n, o, "Date cannot be represented in JSON Schema");
  },
  hl = (e, t, n, o) => {
    let r = e._zod.def,
      i = Mt(r.entries);
    if (i.length === 0) {
      n.not = {};
      return;
    }
    (i.every((a) => typeof a == "number") && (n.type = "number"),
      i.every((a) => typeof a == "string") && (n.type = "string"),
      (n.enum = i));
  },
  yl = (e, t, n, o) => {
    let r = e._zod.def;
    if (r.values.length === 0) {
      n.not = {};
      return;
    }
    let i = [];
    for (let a of r.values)
      if (a === void 0) {
        if (
          ne(
            e,
            t,
            n,
            o,
            "Literal `undefined` cannot be represented in JSON Schema",
          )
        )
          return;
      } else if (typeof a == "bigint") {
        if (
          ne(e, t, n, o, "BigInt literals cannot be represented in JSON Schema")
        )
          return;
        i.push(Number(a));
      } else i.push(a);
    if (i.length !== 0)
      if (i.length === 1) {
        let a = i[0];
        ((n.type = a === null ? "null" : typeof a),
          t.target === "draft-04" || t.target === "openapi-3.0"
            ? (n.enum = [a])
            : (n.const = a));
      } else
        (i.every((a) => typeof a == "number") && (n.type = "number"),
          i.every((a) => typeof a == "string") && (n.type = "string"),
          i.every((a) => typeof a == "boolean") && (n.type = "boolean"),
          i.every((a) => a === null) && (n.type = "null"),
          (n.enum = i));
  },
  $l = (e, t, n, o) => {
    ne(e, t, n, o, "NaN cannot be represented in JSON Schema");
  },
  _l = (e, t, n, o) => {
    let r = n,
      i = e._zod.pattern;
    if (!i) throw new Error("Pattern not found in template literal");
    ((r.type = "string"), (r.pattern = i.source));
  },
  bl = (e, t, n, o) => {
    let r = n;
    ((r.type = "string"),
      (r.format = "binary"),
      (r.contentEncoding = "binary"));
    let { minimum: i, maximum: a, mime: s } = ie(e);
    (i !== void 0 && (r.minLength = i),
      a !== void 0 && (r.maxLength = a),
      s &&
        (s.length === 0
          ? (r.not = {})
          : s.length === 1
            ? (r.contentMediaType = s[0])
            : (r.anyOf = s.map((c) => ({ contentMediaType: c })))));
  },
  xl = (e, t, n, o) => {
    n.type = "boolean";
  },
  kl = (e, t, n, o) => {
    ne(e, t, n, o, "Custom types cannot be represented in JSON Schema");
  },
  wl = (e, t, n, o) => {
    ne(e, t, n, o, "Function types cannot be represented in JSON Schema");
  },
  Il = (e, t, n, o) => {
    ne(e, t, n, o, "Transforms cannot be represented in JSON Schema");
  },
  Sl = (e, t, n, o) => {
    ne(e, t, n, o, "Map cannot be represented in JSON Schema");
  },
  zl = (e, t, n, o) => {
    ne(e, t, n, o, "Set cannot be represented in JSON Schema");
  },
  Pl = (e, t, n, o) => {
    let r = n,
      i = e._zod.def,
      { minimum: a, maximum: s } = ie(e);
    (typeof a == "number" && (r.minItems = a),
      typeof s == "number" && (r.maxItems = s),
      (r.type = "array"),
      (r.items = q(i.element, t, { ...o, path: [...o.path, "items"] })));
  };
function Nn(e) {
  let t = e._zod.def;
  return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform")
    ? Nn(t.out)
    : t.type === "catch"
      ? Nn(t.innerType)
      : e._zod.optin;
}
var Ol = (e, t, n, o) => {
    let r = n,
      i = e._zod.def,
      a = i.shape;
    if (
      Object.getOwnPropertySymbols(a).length &&
      ne(e, t, r, o, "Symbol keys cannot be represented in JSON Schema")
    )
      return;
    ((r.type = "object"), (r.properties = {}));
    for (let u in a)
      se(
        r.properties,
        u,
        q(a[u], t, { ...o, path: [...o.path, "properties", u] }),
      );
    let c = [];
    for (let u of Object.keys(a)) {
      let l = i.shape[u];
      (t.io === "input" ? Nn(l) === void 0 : l._zod.optout === void 0) &&
        c.push(u);
    }
    (c.length > 0 && (r.required = c),
      i.catchall?._zod.def.type === "never"
        ? (r.additionalProperties = !1)
        : i.catchall
          ? i.catchall &&
            (r.additionalProperties = q(i.catchall, t, {
              ...o,
              path: [...o.path, "additionalProperties"],
            }))
          : t.io === "output" && (r.additionalProperties = !1));
  },
  Lo = (e, t, n, o) => {
    let r = e._zod.def,
      i = r.inclusive === !1,
      a = r.options.map((s, c) =>
        q(s, t, { ...o, path: [...o.path, i ? "oneOf" : "anyOf", c] }),
      );
    i ? (n.oneOf = a) : (n.anyOf = a);
  },
  jl = (e, t, n, o) => {
    let r = e._zod.def,
      i = q(r.left, t, { ...o, path: [...o.path, "allOf", 0] }),
      a = q(r.right, t, { ...o, path: [...o.path, "allOf", 1] }),
      s = (u) => "allOf" in u && Object.keys(u).length === 1,
      c = [...(s(i) ? i.allOf : [i]), ...(s(a) ? a.allOf : [a])];
    ((n.allOf = c), t.intersections.push(c));
  },
  Nl = (e, t, n, o) => {
    let r = n,
      i = e._zod.def;
    r.type = "array";
    let a = t.target === "draft-2020-12" ? "prefixItems" : "items",
      s =
        t.target === "draft-2020-12" || t.target === "openapi-3.0"
          ? "items"
          : "additionalItems",
      c = i.items.map((_, S) => q(_, t, { ...o, path: [...o.path, a, S] })),
      u = i.rest
        ? q(i.rest, t, {
            ...o,
            path: [
              ...o.path,
              s,
              ...(t.target === "openapi-3.0" ? [i.items.length] : []),
            ],
          })
        : null,
      l = i.items.length;
    for (; l > 0;) {
      let _ = i.items[l - 1];
      if (!(t.io === "input" ? Nn(_) !== void 0 : _._zod.optout === "optional"))
        break;
      l--;
    }
    let d = i.items.length,
      f = !i.rest;
    t.target === "draft-2020-12"
      ? ((r.prefixItems = c),
        f ? (r.items = !1) : u && (r.items = u),
        l > 0 && (r.minItems = l),
        f && (r.maxItems = d))
      : t.target === "openapi-3.0"
        ? ((r.items = { anyOf: c }),
          u && r.items.anyOf.push(u),
          l > 0 && (r.minItems = l),
          f && (r.maxItems = d))
        : ((r.items = c),
          f ? (r.additionalItems = !1) : u && (r.additionalItems = u),
          l > 0 && (r.minItems = l),
          f && (r.maxItems = d));
    let { minimum: m, maximum: v } = ie(e);
    (typeof m == "number" && (r.minItems = m),
      typeof v == "number" && (r.maxItems = v));
  };
function nl(e, t, n) {
  if (t.$ref) {
    if (n.has(t)) return t;
    n.add(t);
    let v = e.get(t)?.def;
    if (!v) return t;
    let _ = nl(e, v, n);
    return _ === v ? t : _;
  }
  for (let v of ["anyOf", "oneOf"]) {
    let _ = t[v];
    if (!Array.isArray(_)) continue;
    let S = _.map((T) => nl(e, T, n));
    S.some((T, j) => T !== _[j]) && (t = { ...t, [v]: S });
  }
  let o = Array.isArray(t.type) ? t.type : [t.type],
    r =
      !o.includes("string") && o.some((v) => v === "number" || v === "integer"),
    i = t.enum ?? (t.const !== void 0 ? [t.const] : void 0);
  if (!r && !i?.some((v) => typeof v == "number")) return t;
  let {
    minimum: a,
    maximum: s,
    exclusiveMinimum: c,
    exclusiveMaximum: u,
    multipleOf: l,
    format: d,
    id: f,
    ...m
  } = t;
  return (
    m.enum
      ? (m.enum = m.enum.map((v) => (typeof v == "number" ? String(v) : v)))
      : typeof m.const == "number" && (m.const = String(m.const)),
    r &&
      ((m.type = "string"),
      i || (m.pattern = (o.includes("number") ? qe : un).source)),
    m
  );
}
var il = new WeakMap();
function Ex(e) {
  let t = new Map();
  for (let o of e.seen.values())
    o.def && !t.has(o.schema) && t.set(o.schema, o);
  let n = new Map();
  for (let o of il.get(e) ?? []) {
    let r = e.seen.get(o),
      i = (r?.def ?? r?.schema)?.propertyNames;
    if (!i || i === !0 || n.has(i)) continue;
    let a = nl(t, i, new Set());
    a !== i && n.set(i, a);
  }
  if (n.size)
    for (let o of e.seen.values())
      for (let r of [o.schema, o.def]) {
        let i = r && n.get(r.propertyNames);
        i && (r.propertyNames = i);
      }
}
var Tl = (e, t, n, o) => {
    let r = n,
      i = e._zod.def;
    r.type = "object";
    let a = i.keyType,
      s = ie(a).patterns;
    if (i.mode === "loose" && s && s.size > 0) {
      let l = q(i.valueType, t, {
        ...o,
        path: [...o.path, "patternProperties", "*"],
      });
      r.patternProperties = {};
      for (let d of s) se(r.patternProperties, Vg(d).source, l);
    } else {
      if (t.target === "draft-07" || t.target === "draft-2020-12") {
        r.propertyNames = q(i.keyType, t, {
          ...o,
          path: [...o.path, "propertyNames"],
        });
        let l = il.get(t);
        (l || ((l = []), il.set(t, l), t.deferred.push(() => Ex(t))),
          l.push(e));
      }
      r.additionalProperties = q(i.valueType, t, {
        ...o,
        path: [...o.path, "additionalProperties"],
      });
    }
    let c = a._zod.values,
      u = t.io === "input" && Nn(i.valueType) !== void 0;
    if (c && !i.partial && !u) {
      let l = [...c].filter(
        (d) => typeof d == "string" || typeof d == "number",
      );
      l.length > 0 && (r.required = l.map(String));
    }
  },
  Al = (e, t, n, o) => {
    let r = e._zod.def,
      i = q(r.innerType, t, o),
      a = t.seen.get(e);
    t.target === "openapi-3.0"
      ? ((a.ref = r.innerType), (n.nullable = !0))
      : (n.anyOf = [i, { type: "null" }]);
  },
  Dl = (e, t, n, o) => {
    let r = e._zod.def;
    q(r.innerType, t, o);
    let i = t.seen.get(e);
    i.ref = r.innerType;
  },
  Ul = Symbol();
function Fg(e, t, n, o, r) {
  let i = !1,
    a = JSON.stringify(e, (s, c) =>
      typeof c != "bigint" ? c : ((i = !0), null),
    );
  return i
    ? (ne(t, n, o, r, "BigInt defaults cannot be represented in JSON Schema"),
      Ul)
    : JSON.parse(a);
}
var El = (e, t, n, o) => {
    let r = e._zod.def;
    q(r.innerType, t, o);
    let i = t.seen.get(e);
    i.ref = r.innerType;
    let a = Fg(r.defaultValue, e, t, n, o);
    a !== Ul && (n.default = a);
  },
  Zl = (e, t, n, o) => {
    let r = e._zod.def;
    q(r.innerType, t, o);
    let i = t.seen.get(e);
    if (((i.ref = r.innerType), t.io !== "input")) return;
    let a = Fg(r.defaultValue, e, t, n, o);
    a !== Ul && (n._prefault = a);
  },
  Cl = (e, t, n, o) => {
    let r = e._zod.def;
    q(r.innerType, t, o);
    let i = t.seen.get(e);
    i.ref = r.innerType;
    let a;
    try {
      a = r.catchValue(void 0);
    } catch {
      ne(e, t, n, o, "Dynamic catch values are not supported in JSON Schema");
      return;
    }
    n.default = a;
  },
  Ll = (e, t, n, o) => {
    let r = e._zod.def,
      i = r.in._zod.traits.has("$ZodTransform"),
      a = t.io === "input" ? (i ? r.out : r.in) : r.out;
    q(a, t, o);
    let s = t.seen.get(e);
    s.ref = a;
  },
  Rl = (e, t, n, o) => {
    let r = e._zod.def;
    q(r.innerType, t, o);
    let i = t.seen.get(e);
    ((i.ref = r.innerType), (n.readOnly = !0));
  },
  Vl = (e, t, n, o) => {
    let r = e._zod.def;
    q(r.innerType, t, o);
    let i = t.seen.get(e);
    i.ref = r.innerType;
  },
  Ro = (e, t, n, o) => {
    let r = e._zod.def;
    q(r.innerType, t, o);
    let i = t.seen.get(e);
    i.ref = r.innerType;
  },
  Fl = (e, t, n, o) => {
    let r = e._zod.innerType;
    q(r, t, o);
    let i = t.seen.get(e);
    i.ref = r;
  },
  Co = {
    string: ol,
    number: al,
    boolean: sl,
    bigint: ul,
    symbol: cl,
    null: ll,
    undefined: dl,
    void: fl,
    never: ml,
    any: pl,
    unknown: gl,
    date: vl,
    enum: hl,
    literal: yl,
    nan: $l,
    template_literal: _l,
    file: bl,
    success: xl,
    custom: kl,
    function: wl,
    transform: Il,
    map: Sl,
    set: zl,
    array: Pl,
    object: Ol,
    union: Lo,
    intersection: jl,
    tuple: Nl,
    record: Tl,
    nullable: Al,
    nonoptional: Dl,
    default: El,
    prefault: Zl,
    catch: Cl,
    pipe: Ll,
    readonly: Rl,
    promise: Vl,
    optional: Ro,
    lazy: Fl,
  };
function _r(e, t) {
  if ("_idmap" in e) {
    let o = e,
      r = ct({ ...t, processors: Co }),
      i = {};
    for (let c of o._idmap.entries()) {
      let [u, l] = c;
      q(l, r);
    }
    let a = {},
      s = { registry: o, uri: t?.uri, defs: i };
    r.external = s;
    for (let c of o._idmap.entries()) {
      let [u, l] = c;
      (lt(r, l), se(a, u, dt(r, l)));
    }
    if (Object.keys(i).length > 0) {
      let c = r.target === "draft-2020-12" ? "$defs" : "definitions";
      a.__shared = { [c]: i };
    }
    return { schemas: a };
  }
  let n = ct({ ...t, processors: Co });
  return (q(e, n), lt(n, e), dt(n, e));
}
var Vo = class {
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  get target() {
    return this.ctx.target;
  }
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  get override() {
    return this.ctx.override;
  }
  get io() {
    return this.ctx.io;
  }
  get counter() {
    return this.ctx.counter;
  }
  set counter(t) {
    this.ctx.counter = t;
  }
  get seen() {
    return this.ctx.seen;
  }
  constructor(t) {
    let n = t?.target ?? "draft-2020-12";
    (n === "draft-4" && (n = "draft-04"),
      n === "draft-7" && (n = "draft-07"),
      (this.ctx = ct({
        processors: Co,
        target: n,
        ...(t?.metadata && { metadata: t.metadata }),
        ...(t?.unrepresentable && { unrepresentable: t.unrepresentable }),
        ...(t?.override && { override: t.override }),
        ...(t?.io && { io: t.io }),
      })));
  }
  process(t, n = { path: [], schemaPath: [] }) {
    return q(t, this.ctx, n);
  }
  emit(t, n) {
    (n &&
      (n.cycles && (this.ctx.cycles = n.cycles),
      n.reused && (this.ctx.reused = n.reused),
      n.external && (this.ctx.external = n.external)),
      (this.ctx.sharedDefsExtractedFor = void 0),
      (this.ctx.sharedEmitDoneFor = void 0),
      lt(this.ctx, t));
    let o = dt(this.ctx, t),
      { "~standard": r, ...i } = o;
    return i;
  }
};
var Mg = {};
var Pr = {};
Ke(Pr, {
  ZodAny: () => cd,
  ZodArray: () => md,
  ZodBase64: () => aa,
  ZodBase64URL: () => sa,
  ZodBigInt: () => Sr,
  ZodBigIntFormat: () => la,
  ZodBoolean: () => Ir,
  ZodCIDRv4: () => ia,
  ZodCIDRv6: () => oa,
  ZodCUID: () => Ho,
  ZodCUID2: () => Yo,
  ZodCatch: () => Dd,
  ZodCodec: () => Fn,
  ZodCreditCard: () => td,
  ZodCustom: () => Mn,
  ZodCustomStringFormat: () => Ut,
  ZodDate: () => En,
  ZodDefault: () => Pd,
  ZodDiscriminatedUnion: () => gd,
  ZodE164: () => ua,
  ZodEmail: () => Wo,
  ZodEmoji: () => qo,
  ZodEnum: () => xr,
  ZodExactOptional: () => pa,
  ZodFile: () => wd,
  ZodFunction: () => Jd,
  ZodGUID: () => Go,
  ZodIBAN: () => rd,
  ZodIPv4: () => ra,
  ZodIPv6: () => na,
  ZodISODate: () => mt,
  ZodISODateTime: () => ft,
  ZodISODuration: () => gt,
  ZodISOTime: () => pt,
  ZodInstanceOf: () => Wd,
  ZodIntersection: () => vd,
  ZodJWT: () => ca,
  ZodKSUID: () => ta,
  ZodLazy: () => Vd,
  ZodLiteral: () => kd,
  ZodMAC: () => ed,
  ZodMap: () => bd,
  ZodNaN: () => Ed,
  ZodNanoID: () => Xo,
  ZodNever: () => dd,
  ZodNonOptional: () => ga,
  ZodNull: () => sd,
  ZodNullable: () => zd,
  ZodNumber: () => wr,
  ZodNumberFormat: () => Et,
  ZodObject: () => Cn,
  ZodOptional: () => Rn,
  ZodPipe: () => Vn,
  ZodPrefault: () => jd,
  ZodPreprocess: () => Zd,
  ZodPromise: () => Md,
  ZodReadonly: () => Cd,
  ZodRecord: () => br,
  ZodSet: () => xd,
  ZodString: () => kr,
  ZodStringFormat: () => X,
  ZodSuccess: () => Ad,
  ZodSymbol: () => od,
  ZodTemplateLiteral: () => Rd,
  ZodTransform: () => Id,
  ZodTuple: () => yd,
  ZodType: () => L,
  ZodULID: () => Qo,
  ZodURL: () => Un,
  ZodUUID: () => Me,
  ZodUndefined: () => ad,
  ZodUnion: () => Ln,
  ZodUnknown: () => ld,
  ZodVoid: () => fd,
  ZodXID: () => ea,
  ZodXor: () => pd,
  _ZodString: () => Ko,
  _default: () => Od,
  _function: () => th,
  any: () => Tv,
  array: () => Zn,
  base64: () => fv,
  base64url: () => mv,
  bigint: () => zv,
  boolean: () => id,
  catch: () => Ud,
  check: () => rh,
  cidrv4: () => lv,
  cidrv6: () => dv,
  codec: () => Hv,
  creditCard: () => gv,
  cuid: () => rv,
  cuid2: () => nv,
  currencyCode: () => bv,
  custom: () => nh,
  date: () => Dv,
  describe: () => ih,
  discriminatedUnion: () => Rv,
  e164: () => pv,
  email: () => Kg,
  emoji: () => ev,
  enum: () => fa,
  exactOptional: () => Sd,
  file: () => Wv,
  float32: () => kv,
  float64: () => wv,
  function: () => th,
  guid: () => Wg,
  hash: () => xv,
  hex: () => _v,
  hostname: () => $v,
  httpUrl: () => Qg,
  iban: () => vv,
  instanceof: () => ah,
  int: () => Jo,
  int32: () => Iv,
  int64: () => Pv,
  intersection: () => hd,
  invertCodec: () => Yv,
  ipv4: () => sv,
  ipv6: () => cv,
  json: () => uh,
  jwt: () => hv,
  keyof: () => Uv,
  ksuid: () => av,
  lazy: () => Fd,
  literal: () => Kv,
  looseObject: () => Cv,
  looseRecord: () => Fv,
  mac: () => uv,
  map: () => Mv,
  meta: () => oh,
  nan: () => Xv,
  nanoid: () => tv,
  nativeEnum: () => Bv,
  never: () => da,
  nonoptional: () => Td,
  null: () => ud,
  nullable: () => Dn,
  nullish: () => Gv,
  number: () => nd,
  object: () => Ev,
  optional: () => At,
  partialRecord: () => Vv,
  pipe: () => Bo,
  prefault: () => Nd,
  preprocess: () => ch,
  promise: () => eh,
  readonly: () => Ld,
  record: () => _d,
  refine: () => Bd,
  set: () => Jv,
  strictObject: () => Zv,
  string: () => An,
  stringFormat: () => yv,
  stringbool: () => sh,
  success: () => qv,
  superRefine: () => Kd,
  symbol: () => jv,
  templateLiteral: () => Qv,
  transform: () => ma,
  tuple: () => $d,
  uint32: () => Sv,
  uint64: () => Ov,
  ulid: () => iv,
  undefined: () => Nv,
  union: () => zr,
  unknown: () => Tt,
  url: () => Yg,
  uuid: () => Gg,
  uuidv4: () => qg,
  uuidv6: () => Xg,
  uuidv7: () => Hg,
  void: () => Av,
  xid: () => ov,
  xor: () => Lv,
});
var Fo = {};
Ke(Fo, {
  endsWith: () => cr,
  gt: () => Ve,
  gte: () => we,
  includes: () => sr,
  length: () => jt,
  lowercase: () => or,
  lt: () => Re,
  lte: () => ke,
  maxLength: () => Ot,
  maxSize: () => ut,
  mime: () => dr,
  minLength: () => Xe,
  minSize: () => Fe,
  multipleOf: () => st,
  negative: () => Do,
  nonnegative: () => Eo,
  nonpositive: () => Uo,
  normalize: () => fr,
  overwrite: () => Ue,
  positive: () => Ao,
  properties: () => lr,
  property: () => Zo,
  regex: () => ir,
  size: () => Pt,
  slugify: () => vr,
  startsWith: () => ur,
  toLowerCase: () => pr,
  toUpperCase: () => gr,
  trim: () => mr,
  uppercase: () => ar,
});
var Jg = new WeakSet([Object.prototype, Error.prototype]);
function Mo(e, t, n) {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    get() {
      let o = n(this);
      return (
        Object.defineProperty(this, t, {
          value: o,
          configurable: !0,
          writable: !0,
        }),
        o
      );
    },
    set(o) {
      Object.defineProperty(this, t, {
        value: o,
        configurable: !0,
        writable: !0,
      });
    },
  });
}
var Bg = (e, t) => {
    (Fa.init(e, t), (e.name = "ZodError"));
    let n = Object.getPrototypeOf(e);
    Jg.has(n) ||
      (Jg.add(n),
      Mo(n, "format", (o) => (r) => nn(o, r)),
      Mo(n, "flatten", (o) => (r) => rn(o, r)),
      Mo(n, "addIssue", (o) => (r) => {
        (o.issues.push(r), (o.message = JSON.stringify(o.issues, Jt, 2)));
      }),
      Mo(n, "addIssues", (o) => (r) => {
        (o.issues.push(...r), (o.message = JSON.stringify(o.issues, Jt, 2)));
      }),
      Object.defineProperty(n, "isEmpty", {
        configurable: !0,
        enumerable: !1,
        get() {
          return this.issues.length === 0;
        },
      }));
  },
  Cx = p("ZodError", Bg),
  xe = p("ZodError", Bg, void 0, { Parent: Error });
var Ml = qt(xe),
  Jl = Xt(xe),
  Bl = Ht(xe),
  Tn = Yt(xe),
  Kl = yi(xe),
  Wl = $i(xe),
  Gl = _i(xe),
  ql = bi(xe),
  Xl = xi(xe),
  Hl = ki(xe),
  Yl = wi(xe),
  Ql = Ii(xe);
function Rx() {
  ae.localeError || te(no());
}
function Dt() {
  ae.memoizer || te({ memoizer: xn() });
}
var L = p(
    "ZodType",
    (e, t) => (Rx(), C.init(e, t), (e.def = t), (e.type = t.type), e),
    {
      check(...e) {
        let t = this.def;
        return this.clone(
          h.mergeDefs(t, {
            checks: [
              ...(t.checks ?? []),
              ...e.map((n) =>
                typeof n == "function"
                  ? {
                      _zod: {
                        check: n,
                        def: { check: "custom" },
                        onattach: [],
                      },
                    }
                  : n,
              ),
            ],
          }),
          { parent: !0 },
        );
      },
      with(...e) {
        return this.check(...e);
      },
      clone(e, t) {
        return W(this, e, t);
      },
      brand() {
        return this;
      },
      register(e, t) {
        return (e.add(this, t), this);
      },
      refine(e, t) {
        return this.check(Bd(e, t));
      },
      superRefine(e, t) {
        return this.check(Kd(e, t));
      },
      overwrite(e) {
        return this.check(Ue(e));
      },
      optional() {
        return At(this);
      },
      exactOptional() {
        return Sd(this);
      },
      nullable() {
        return Dn(this);
      },
      nullish() {
        return At(Dn(this));
      },
      nonoptional(e) {
        return Td(this, e);
      },
      array() {
        return Zn(this);
      },
      or(e) {
        return zr([this, e]);
      },
      and(e) {
        return hd(this, e);
      },
      transform(e) {
        return Bo(this, ma(e));
      },
      default(e) {
        return Od(this, e);
      },
      prefault(e) {
        return Nd(this, e);
      },
      catch(e) {
        return Ud(this, e);
      },
      pipe(e) {
        return Bo(this, e);
      },
      readonly() {
        return Ld(this);
      },
      describe(e) {
        let t = this.clone();
        return (ue.add(t, { description: e }), t);
      },
      meta(...e) {
        if (e.length === 0) return ue.get(this);
        let t = this.clone();
        return (ue.add(t, e[0]), t);
      },
      isOptional() {
        return this.safeParse(void 0).success;
      },
      isNullable() {
        return this.safeParse(null).success;
      },
      apply(e, ...t) {
        return t.length === 0 ? e(this) : e(this, ...t);
      },
      get "~standard"() {
        return h.hide(this, "~standard", {
          ...Ei(this),
          jsonSchema: { input: hr(this, "input"), output: hr(this, "output") },
        });
      },
      set "~standard"(e) {
        h.own(this, "~standard", e);
      },
      parse: function e(t, n) {
        return Ml(this, t, n, { callee: e });
      },
      parseAsync: async function e(t, n) {
        return await Jl(this, t, n, { callee: e });
      },
      safeParse(e, t) {
        return Bl(this, e, t);
      },
      async safeParseAsync(e, t) {
        return Tn(this, e, t);
      },
      get spa() {
        return this?.safeParseAsync;
      },
      set spa(e) {
        h.own(this, "spa", e);
      },
      validate(e, t) {
        return on(this, e, t);
      },
      validateAsync(e, t) {
        return an(this, e, t);
      },
      encode: function e(t, n) {
        return Kl(this, t, n, { callee: e });
      },
      decode: function e(t, n) {
        return Wl(this, t, n, { callee: e });
      },
      encodeAsync: async function e(t, n) {
        return await Gl(this, t, n, { callee: e });
      },
      decodeAsync: async function e(t, n) {
        return await ql(this, t, n, { callee: e });
      },
      safeEncode(e, t) {
        return Xl(this, e, t);
      },
      safeDecode(e, t) {
        return Hl(this, e, t);
      },
      async safeEncodeAsync(e, t) {
        return Yl(this, e, t);
      },
      async safeDecodeAsync(e, t) {
        return Ql(this, e, t);
      },
      toJSONSchema(e) {
        return rl(this, {})(e);
      },
      get description() {
        return ue.get(this)?.description;
      },
      get _def() {
        return this._zod.def;
      },
    },
  ),
  Ko = p(
    "_ZodString",
    (e, t) => {
      (wt.init(e, t),
        L.init(e, t),
        (e._zod.processJSONSchema = (n, o, r) => ol(e, n, o, r)));
    },
    h.derived(
      {
        format: (e) => ie(e).format ?? null,
        minLength: (e) => ie(e).minimum ?? null,
        maxLength: (e) => ie(e).maximum ?? null,
      },
      {
        regex(...e) {
          return this.check(ir(...e));
        },
        includes(...e) {
          return this.check(sr(...e));
        },
        startsWith(...e) {
          return this.check(ur(...e));
        },
        endsWith(...e) {
          return this.check(cr(...e));
        },
        min(...e) {
          return this.check(Xe(...e));
        },
        max(...e) {
          return this.check(Ot(...e));
        },
        length(...e) {
          return this.check(jt(...e));
        },
        nonempty(...e) {
          return this.check(Xe(1, ...e));
        },
        lowercase(e) {
          return this.check(or(e));
        },
        uppercase(e) {
          return this.check(ar(e));
        },
        trim() {
          return this.check(mr());
        },
        normalize(...e) {
          return this.check(fr(...e));
        },
        toLowerCase() {
          return this.check(pr());
        },
        toUpperCase() {
          return this.check(gr());
        },
        slugify() {
          return this.check(vr());
        },
      },
    ),
  ),
  kr = p(
    "ZodString",
    (e, t) => {
      (wt.init(e, t), Ko.init(e, t));
    },
    {
      email(e) {
        return this.check(fo(Wo, e));
      },
      url(e) {
        return this.check(In(Un, e));
      },
      jwt(e) {
        return this.check(To(ca, e));
      },
      emoji(e) {
        return this.check(yo(qo, e));
      },
      guid(e) {
        return this.check(mo(Go, e));
      },
      uuid(e) {
        return this.check(po(Me, e));
      },
      uuidv4(e) {
        return this.check(go(Me, e));
      },
      uuidv6(e) {
        return this.check(vo(Me, e));
      },
      uuidv7(e) {
        return this.check(ho(Me, e));
      },
      nanoid(e) {
        return this.check($o(Xo, e));
      },
      cuid(e) {
        return this.check(_o(Ho, e));
      },
      cuid2(e) {
        return this.check(bo(Yo, e));
      },
      ulid(e) {
        return this.check(xo(Qo, e));
      },
      base64(e) {
        return this.check(Oo(aa, e));
      },
      base64url(e) {
        return this.check(jo(sa, e));
      },
      xid(e) {
        return this.check(ko(ea, e));
      },
      ksuid(e) {
        return this.check(wo(ta, e));
      },
      ipv4(e) {
        return this.check(Io(ra, e));
      },
      ipv6(e) {
        return this.check(So(na, e));
      },
      cidrv4(e) {
        return this.check(zo(ia, e));
      },
      cidrv6(e) {
        return this.check(Po(oa, e));
      },
      e164(e) {
        return this.check(No(ua, e));
      },
      datetime(e) {
        return this.check(Sn(ft, e));
      },
      date(e) {
        return this.check(zn(mt, e));
      },
      time(e) {
        return this.check(Pn(pt, e));
      },
      duration(e) {
        return this.check(On(gt, e));
      },
    },
  );
function An(e) {
  return yc(kr, e);
}
var X = p("ZodStringFormat", (e, t) => {
    (G.init(e, t), Ko.init(e, t));
  }),
  ft = p("ZodISODateTime", (e, t) => {
    (uu.init(e, t), X.init(e, t));
  }),
  mt = p("ZodISODate", (e, t) => {
    (cu.init(e, t), X.init(e, t));
  }),
  pt = p("ZodISOTime", (e, t) => {
    (lu.init(e, t), X.init(e, t));
  }),
  gt = p("ZodISODuration", (e, t) => {
    (du.init(e, t), X.init(e, t));
  }),
  Wo = p("ZodEmail", (e, t) => {
    (Hs.init(e, t), X.init(e, t));
  });
function Kg(e) {
  return fo(Wo, e);
}
var Go = p("ZodGUID", (e, t) => {
  (qs.init(e, t), X.init(e, t));
});
function Wg(e) {
  return mo(Go, e);
}
var Me = p("ZodUUID", (e, t) => {
  (Xs.init(e, t), X.init(e, t));
});
function Gg(e) {
  return po(Me, e);
}
function qg(e) {
  return go(Me, e);
}
function Xg(e) {
  return vo(Me, e);
}
function Hg(e) {
  return ho(Me, e);
}
var Un = p("ZodURL", (e, t) => {
  (eu.init(e, t), X.init(e, t));
});
function Yg(e) {
  return In(Un, e);
}
function Qg(e) {
  return In(Un, { protocol: sn, hostname: ds, ...h.normalizeParams(e) });
}
var qo = p("ZodEmoji", (e, t) => {
  (tu.init(e, t), X.init(e, t));
});
function ev(e) {
  return yo(qo, e);
}
var Xo = p("ZodNanoID", (e, t) => {
  (ru.init(e, t), X.init(e, t));
});
function tv(e) {
  return $o(Xo, e);
}
var Ho = p("ZodCUID", (e, t) => {
  (nu.init(e, t), X.init(e, t));
});
function rv(e) {
  return _o(Ho, e);
}
var Yo = p("ZodCUID2", (e, t) => {
  (iu.init(e, t), X.init(e, t));
});
function nv(e) {
  return bo(Yo, e);
}
var Qo = p("ZodULID", (e, t) => {
  (ou.init(e, t), X.init(e, t));
});
function iv(e) {
  return xo(Qo, e);
}
var ea = p("ZodXID", (e, t) => {
  (au.init(e, t), X.init(e, t));
});
function ov(e) {
  return ko(ea, e);
}
var ta = p("ZodKSUID", (e, t) => {
  (su.init(e, t), X.init(e, t));
});
function av(e) {
  return wo(ta, e);
}
var ra = p("ZodIPv4", (e, t) => {
  (fu.init(e, t), X.init(e, t));
});
function sv(e) {
  return Io(ra, e);
}
var ed = p("ZodMAC", (e, t) => {
  (pu.init(e, t), X.init(e, t));
});
function uv(e) {
  return _c(ed, e);
}
var na = p("ZodIPv6", (e, t) => {
  (mu.init(e, t), X.init(e, t));
});
function cv(e) {
  return So(na, e);
}
var ia = p("ZodCIDRv4", (e, t) => {
  (gu.init(e, t), X.init(e, t));
});
function lv(e) {
  return zo(ia, e);
}
var oa = p("ZodCIDRv6", (e, t) => {
  (vu.init(e, t), X.init(e, t));
});
function dv(e) {
  return Po(oa, e);
}
var aa = p("ZodBase64", (e, t) => {
  (hu.init(e, t), X.init(e, t));
});
function fv(e) {
  return Oo(aa, e);
}
var sa = p("ZodBase64URL", (e, t) => {
  (yu.init(e, t), X.init(e, t));
});
function mv(e) {
  return jo(sa, e);
}
var ua = p("ZodE164", (e, t) => {
  ($u.init(e, t), X.init(e, t));
});
function pv(e) {
  return No(ua, e);
}
var td = p("ZodCreditCard", (e, t) => {
  (_u.init(e, t), X.init(e, t));
});
function gv(e) {
  return bc(td, e);
}
var rd = p("ZodIBAN", (e, t) => {
  (bu.init(e, t), X.init(e, t));
});
function vv(e) {
  return xc(rd, e);
}
var ca = p("ZodJWT", (e, t) => {
  (xu.init(e, t), X.init(e, t));
});
function hv(e) {
  return To(ca, e);
}
var Ut = p("ZodCustomStringFormat", (e, t) => {
  (ku.init(e, t), X.init(e, t));
});
function yv(e, t, n = {}) {
  return Nt(Ut, e, t, n);
}
function $v(e) {
  return Nt(Ut, "hostname", ls, e);
}
function _v(e) {
  return Nt(Ut, "hex", Is, e);
}
function bv(e) {
  return Nt(Ut, "currency_code", ms, e);
}
function xv(e, t) {
  let n = t?.enc ?? "hex",
    o = `${e}_${n}`,
    r = Ne[o];
  if (!r) throw new Error(`Unrecognized hash format: ${o}`);
  return Nt(Ut, o, r, t);
}
var wr = p(
  "ZodNumber",
  (e, t) => {
    (Ki.init(e, t),
      L.init(e, t),
      (e._zod.processJSONSchema = (n, o, r) => al(e, n, o, r)),
      (e.isFinite = !0));
  },
  h.derived(
    {
      minValue: (e) => {
        let { minimum: t, exclusiveMinimum: n } = ie(e);
        return Math.max(
          t ?? Number.NEGATIVE_INFINITY,
          n ?? Number.NEGATIVE_INFINITY,
        );
      },
      maxValue: (e) => {
        let { maximum: t, exclusiveMaximum: n } = ie(e);
        return Math.min(
          t ?? Number.POSITIVE_INFINITY,
          n ?? Number.POSITIVE_INFINITY,
        );
      },
      isInt: (e) => {
        let { isInt: t, multipleOf: n } = ie(e);
        return !!t || !!n?.some(Number.isSafeInteger);
      },
      format: (e) => ie(e).format ?? null,
    },
    {
      gt(e, t) {
        return this.check(Ve(e, t));
      },
      gte(e, t) {
        return this.check(we(e, t));
      },
      min(e, t) {
        return this.check(we(e, t));
      },
      lt(e, t) {
        return this.check(Re(e, t));
      },
      lte(e, t) {
        return this.check(ke(e, t));
      },
      max(e, t) {
        return this.check(ke(e, t));
      },
      int(e) {
        return this.check(Jo(e));
      },
      safe(e) {
        return this.check(Jo(e));
      },
      positive(e) {
        return this.check(Ve(0, e));
      },
      nonnegative(e) {
        return this.check(we(0, e));
      },
      negative(e) {
        return this.check(Re(0, e));
      },
      nonpositive(e) {
        return this.check(ke(0, e));
      },
      multipleOf(e, t) {
        return this.check(st(e, t));
      },
      step(e, t) {
        return this.check(st(e, t));
      },
      finite() {
        return this;
      },
    },
  ),
);
function nd(e) {
  return wc(wr, e);
}
var Et = p("ZodNumberFormat", (e, t) => {
  (wu.init(e, t), wr.init(e, t));
});
function Jo(e) {
  return Sc(Et, e);
}
function kv(e) {
  return zc(Et, e);
}
function wv(e) {
  return Pc(Et, e);
}
function Iv(e) {
  return Oc(Et, e);
}
function Sv(e) {
  return jc(Et, e);
}
var Ir = p("ZodBoolean", (e, t) => {
  (vn.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => sl(e, n, o, r)));
});
function id(e) {
  return Nc(Ir, e);
}
var Sr = p(
  "ZodBigInt",
  (e, t) => {
    (Wi.init(e, t),
      L.init(e, t),
      (e._zod.processJSONSchema = (n, o, r) => ul(e, n, o, r)));
  },
  h.derived(
    {
      minValue: (e) => ie(e).minimum ?? null,
      maxValue: (e) => ie(e).maximum ?? null,
      format: (e) => ie(e).format ?? null,
    },
    {
      gte(e, t) {
        return this.check(we(e, t));
      },
      min(e, t) {
        return this.check(we(e, t));
      },
      gt(e, t) {
        return this.check(Ve(e, t));
      },
      lt(e, t) {
        return this.check(Re(e, t));
      },
      lte(e, t) {
        return this.check(ke(e, t));
      },
      max(e, t) {
        return this.check(ke(e, t));
      },
      positive(e) {
        return this.check(Ve(BigInt(0), e));
      },
      negative(e) {
        return this.check(Re(BigInt(0), e));
      },
      nonpositive(e) {
        return this.check(ke(BigInt(0), e));
      },
      nonnegative(e) {
        return this.check(we(BigInt(0), e));
      },
      multipleOf(e, t) {
        return this.check(st(e, t));
      },
    },
  ),
);
function zv(e) {
  return Ac(Sr, e);
}
var la = p("ZodBigIntFormat", (e, t) => {
  (Iu.init(e, t), Sr.init(e, t));
});
function Pv(e) {
  return Uc(la, e);
}
function Ov(e) {
  return Ec(la, e);
}
var od = p("ZodSymbol", (e, t) => {
  (Su.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => cl(e, n, o, r)));
});
function jv(e) {
  return Zc(od, e);
}
var ad = p("ZodUndefined", (e, t) => {
  (zu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => dl(e, n, o, r)));
});
function Nv(e) {
  return Cc(ad, e);
}
var sd = p("ZodNull", (e, t) => {
  (Pu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => ll(e, n, o, r)));
});
function ud(e) {
  return Lc(sd, e);
}
var cd = p("ZodAny", (e, t) => {
  (Ou.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => pl(e, n, o, r)));
});
function Tv() {
  return Rc(cd);
}
var ld = p("ZodUnknown", (e, t) => {
  (ju.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => gl(e, n, o, r)));
});
function Tt() {
  return Vc(ld);
}
var dd = p("ZodNever", (e, t) => {
  (Nu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => ml(e, n, o, r)));
});
function da(e) {
  return Fc(dd, e);
}
var fd = p("ZodVoid", (e, t) => {
  (Tu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => fl(e, n, o, r)));
});
function Av(e) {
  return Mc(fd, e);
}
var En = p(
  "ZodDate",
  (e, t) => {
    (Au.init(e, t),
      L.init(e, t),
      (e._zod.processJSONSchema = (n, o, r) => vl(e, n, o, r)),
      (e.min = (n, o) => e.check(we(n, o))),
      (e.max = (n, o) => e.check(ke(n, o))));
  },
  h.derived(
    {
      minDate: (e) => {
        let { minimum: t } = ie(e);
        return t ? new Date(t) : null;
      },
      maxDate: (e) => {
        let { maximum: t } = ie(e);
        return t ? new Date(t) : null;
      },
    },
    {},
  ),
);
function Dv(e) {
  return Jc(En, e);
}
var md = p(
  "ZodArray",
  (e, t) => {
    (Dt(),
      Uu.init(e, t),
      L.init(e, t),
      (e._zod.processJSONSchema = (n, o, r) => Pl(e, n, o, r)),
      (e.element = t.element));
  },
  {
    min(e, t) {
      return this.check(Xe(e, t));
    },
    nonempty(e) {
      return this.check(Xe(1, e));
    },
    max(e, t) {
      return this.check(Ot(e, t));
    },
    length(e, t) {
      return this.check(jt(e, t));
    },
    unwrap() {
      return this.element;
    },
  },
);
function Zn(e, t) {
  return Wc(md, e, t);
}
function Uv(e) {
  let t = e._zod.def.shape;
  return fa(Object.keys(t));
}
var Cn = p(
  "ZodObject",
  (e, t) => {
    (Dt(),
      Eu.init(e, t),
      L.init(e, t),
      (e._zod.processJSONSchema = (n, o, r) => Ol(e, n, o, r)),
      h.installLazyProp(e, "shape", (n) => n._zod.def.shape, !1));
  },
  {
    keyof() {
      return fa(Object.keys(this._zod.def.shape));
    },
    catchall(e) {
      return this.clone(h.mergeDefs(this._zod.def, { catchall: e }));
    },
    passthrough() {
      return this.clone(h.mergeDefs(this._zod.def, { catchall: Tt() }));
    },
    loose() {
      return this.clone(h.mergeDefs(this._zod.def, { catchall: Tt() }));
    },
    strict() {
      return this.clone(h.mergeDefs(this._zod.def, { catchall: da() }));
    },
    strip() {
      return this.clone(h.mergeDefs(this._zod.def, { catchall: void 0 }));
    },
    extend(e) {
      return h.extend(this, e);
    },
    safeExtend(e) {
      return h.safeExtend(this, e);
    },
    merge(e) {
      return h.merge(this, e);
    },
    pick(e) {
      return h.pick(this, e);
    },
    omit(e) {
      return h.omit(this, e);
    },
    partial(...e) {
      return h.partial(Rn, this, e[0]);
    },
    exactPartial(...e) {
      return h.partial(pa, this, e[0], "exactPartial");
    },
    required(...e) {
      return h.required(ga, this, e[0]);
    },
  },
);
function Ev(e, t) {
  let n = { type: "object", shape: e ?? {}, ...h.normalizeParams(t) };
  return new Cn(n);
}
function Zv(e, t) {
  return new Cn({
    type: "object",
    shape: e,
    catchall: da(),
    ...h.normalizeParams(t),
  });
}
function Cv(e, t) {
  return new Cn({
    type: "object",
    shape: e,
    catchall: Tt(),
    ...h.normalizeParams(t),
  });
}
var Ln = p("ZodUnion", (e, t) => {
  (hn.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Lo(e, n, o, r)),
    (e.options = t.options));
});
function zr(e, t) {
  return new Ln({ type: "union", options: e, ...h.normalizeParams(t) });
}
var pd = p("ZodXor", (e, t) => {
  (Ln.init(e, t),
    Zu.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Lo(e, n, o, r)),
    (e.options = t.options));
});
function Lv(e, t) {
  return new pd({
    type: "union",
    options: e,
    inclusive: !1,
    ...h.normalizeParams(t),
  });
}
var gd = p("ZodDiscriminatedUnion", (e, t) => {
  (Ln.init(e, t), Lu.init(e, t));
});
function Rv(e, t, n) {
  return new gd({
    type: "union",
    options: t,
    discriminator: e,
    ...h.normalizeParams(n),
  });
}
var vd = p("ZodIntersection", (e, t) => {
  (Ru.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => jl(e, n, o, r)));
});
function hd(e, t) {
  return new vd({ type: "intersection", left: e, right: t });
}
var yd = p(
  "ZodTuple",
  (e, t) => {
    (Dt(),
      Gi.init(e, t),
      L.init(e, t),
      (e._zod.processJSONSchema = (n, o, r) => Nl(e, n, o, r)));
  },
  {
    rest(e) {
      return this.clone({ ...this._zod.def, rest: e });
    },
    partial() {
      let e = this._zod.def;
      if (e.checks?.length)
        throw new Error(
          ".partial() cannot be used on tuple schemas containing refinements",
        );
      return this.clone({
        ...e,
        items: e.items.map((t) => new Rn({ type: "optional", innerType: t })),
      });
    },
  },
);
function $d(e, t, n) {
  let o = t instanceof C,
    r = o ? n : t,
    i = o ? t : null;
  return new yd({ type: "tuple", items: e, rest: i, ...h.normalizeParams(r) });
}
var br = p("ZodRecord", (e, t) => {
  (Dt(),
    Vu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Tl(e, n, o, r)),
    (e.keyType = t.keyType),
    (e.valueType = t.valueType));
});
function _d(e, t, n) {
  return !t || !t._zod
    ? new br({
        type: "record",
        keyType: An(),
        valueType: e,
        ...h.normalizeParams(t),
      })
    : new br({
        type: "record",
        keyType: e,
        valueType: t,
        ...h.normalizeParams(n),
      });
}
function Vv(e, t, n) {
  return new br({
    type: "record",
    keyType: e,
    valueType: t,
    ...h.normalizeParams(n),
    partial: !0,
  });
}
function Fv(e, t, n) {
  return new br({
    type: "record",
    keyType: e,
    valueType: t,
    mode: "loose",
    ...h.normalizeParams(n),
  });
}
var bd = p("ZodMap", (e, t) => {
  (Dt(),
    Fu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Sl(e, n, o, r)),
    (e.keyType = t.keyType),
    (e.valueType = t.valueType),
    (e.min = (...n) => e.check(Fe(...n))),
    (e.nonempty = (n) => e.check(Fe(1, n))),
    (e.max = (...n) => e.check(ut(...n))),
    (e.size = (...n) => e.check(Pt(...n))));
});
function Mv(e, t, n) {
  return new bd({
    type: "map",
    keyType: e,
    valueType: t,
    ...h.normalizeParams(n),
  });
}
var xd = p("ZodSet", (e, t) => {
  (Dt(),
    Mu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => zl(e, n, o, r)),
    (e.min = (...n) => e.check(Fe(...n))),
    (e.nonempty = (n) => e.check(Fe(1, n))),
    (e.max = (...n) => e.check(ut(...n))),
    (e.size = (...n) => e.check(Pt(...n))));
});
function Jv(e, t) {
  return new xd({ type: "set", valueType: e, ...h.normalizeParams(t) });
}
var xr = p("ZodEnum", (e, t) => {
  (Ju.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (o, r, i) => hl(e, o, r, i)),
    (e.enum = t.entries),
    (e.options = [...e._zod.values]));
  let n = new Set(Object.keys(t.entries));
  ((e.extract = (o, r) => {
    let i = {};
    for (let a of o)
      if (n.has(a)) i[a] = t.entries[a];
      else throw new Error(`Key ${a} not found in enum`);
    return new xr({ ...t, checks: [], ...h.normalizeParams(r), entries: i });
  }),
    (e.exclude = (o, r) => {
      let i = { ...t.entries };
      for (let a of o)
        if (n.has(a)) delete i[a];
        else throw new Error(`Key ${a} not found in enum`);
      return new xr({ ...t, checks: [], ...h.normalizeParams(r), entries: i });
    }));
});
function fa(e, t) {
  let n = Array.isArray(e) ? Object.fromEntries(e.map((o) => [o, o])) : e;
  return new xr({ type: "enum", entries: n, ...h.normalizeParams(t) });
}
function Bv(e, t) {
  return new xr({ type: "enum", entries: e, ...h.normalizeParams(t) });
}
var kd = p("ZodLiteral", (e, t) => {
  (Bu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => yl(e, n, o, r)),
    (e.values = new Set(t.values)),
    Object.defineProperty(e, "value", {
      get() {
        if (t.values.length > 1)
          throw new Error(
            "This schema contains multiple valid literal values. Use `.values` instead.",
          );
        return t.values[0];
      },
    }));
});
function Kv(e, t) {
  return new kd({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...h.normalizeParams(t),
  });
}
var wd = p("ZodFile", (e, t) => {
  (Ku.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => bl(e, n, o, r)),
    (e.min = (n, o) => e.check(Fe(n, o))),
    (e.max = (n, o) => e.check(ut(n, o))),
    (e.mime = (n, o) => e.check(dr(Array.isArray(n) ? n : [n], o))));
});
function Wv(e) {
  return Gc(wd, e);
}
var Id = p("ZodTransform", (e, t) => {
  (Dt(),
    Wu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Il(e, n, o, r)),
    (e._zod.parse = (n, o) => {
      if (o.direction === "backward") throw new ot(e.constructor.name);
      n.addIssue = (i) => {
        if (typeof i == "string") n.issues.push(h.issue(i, n.value, t));
        else {
          let a = i;
          (a.fatal && (a.continue = !1),
            a.code ?? (a.code = "custom"),
            "input" in a || (a.input = n.value),
            a.inst ?? (a.inst = e),
            n.issues.push(h.issue(a)));
        }
      };
      let r = t.transform(n.value, n);
      return r instanceof Promise
        ? r.then((i) => ((n.value = i), n))
        : ((n.value = r), n);
    }));
});
function ma(e) {
  return new Id({ type: "transform", transform: e });
}
var Rn = p("ZodOptional", (e, t) => {
  (qi.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Ro(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType));
});
function At(e) {
  return new Rn({ type: "optional", innerType: e });
}
var pa = p("ZodExactOptional", (e, t) => {
  (Gu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Ro(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType));
});
function Sd(e) {
  return new pa({ type: "optional", innerType: e });
}
var zd = p("ZodNullable", (e, t) => {
  (qu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Al(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType));
});
function Dn(e) {
  return new zd({ type: "nullable", innerType: e });
}
function Gv(e) {
  return At(Dn(e));
}
var Pd = p("ZodDefault", (e, t) => {
  (Xu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => El(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType),
    (e.removeDefault = e.unwrap));
});
function Od(e, t) {
  return new Pd({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : h.shallowClone(t);
    },
  });
}
var jd = p("ZodPrefault", (e, t) => {
  (Hu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Zl(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType));
});
function Nd(e, t) {
  return new jd({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : h.shallowClone(t);
    },
  });
}
var ga = p("ZodNonOptional", (e, t) => {
  (Yu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Dl(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType));
});
function Td(e, t) {
  return new ga({ type: "nonoptional", innerType: e, ...h.normalizeParams(t) });
}
var Ad = p("ZodSuccess", (e, t) => {
  (Qu.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => xl(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType));
});
function qv(e) {
  return new Ad({ type: "success", innerType: e });
}
var Dd = p("ZodCatch", (e, t) => {
  (ec.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Cl(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType),
    (e.removeCatch = e.unwrap));
});
function Ud(e, t) {
  return new Dd({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : h.constantCatch(t),
  });
}
var Ed = p("ZodNaN", (e, t) => {
  (tc.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => $l(e, n, o, r)));
});
function Xv(e) {
  return Kc(Ed, e);
}
var Vn = p("ZodPipe", (e, t) => {
  (Xi.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Ll(e, n, o, r)),
    (e.in = t.in),
    (e.out = t.out));
});
function Bo(e, t) {
  return new Vn({ type: "pipe", in: e, out: t });
}
var Fn = p("ZodCodec", (e, t) => {
  (Vn.init(e, t), yn.init(e, t));
});
function Hv(e, t, n) {
  return new Fn({
    type: "pipe",
    in: e,
    out: t,
    transform: n.decode,
    reverseTransform: n.encode,
  });
}
function Yv(e) {
  let t = e._zod.def;
  return new Fn({
    type: "pipe",
    in: t.out,
    out: t.in,
    transform: t.reverseTransform,
    reverseTransform: t.transform,
  });
}
var Zd = p("ZodPreprocess", (e, t) => {
    (Vn.init(e, t), rc.init(e, t));
  }),
  Cd = p("ZodReadonly", (e, t) => {
    (nc.init(e, t),
      L.init(e, t),
      (e._zod.processJSONSchema = (n, o, r) => Rl(e, n, o, r)),
      (e.unwrap = () => e._zod.def.innerType));
  });
function Ld(e) {
  return new Cd({ type: "readonly", innerType: e });
}
var Rd = p("ZodTemplateLiteral", (e, t) => {
  (ic.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => _l(e, n, o, r)));
});
function Qv(e, t) {
  return new Rd({
    type: "template_literal",
    parts: e,
    ...h.normalizeParams(t),
  });
}
var Vd = p("ZodLazy", (e, t) => {
  ($n.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Fl(e, n, o, r)),
    (e.unwrap = () => e._zod.def.getter()));
});
function Fd(e) {
  return new Vd({ type: "lazy", getter: e });
}
var Md = p("ZodPromise", (e, t) => {
  (ac.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => Vl(e, n, o, r)),
    (e.unwrap = () => e._zod.def.innerType));
});
function eh(e) {
  return new Md({ type: "promise", innerType: e });
}
var Jd = p("ZodFunction", (e, t) => {
  (oc.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => wl(e, n, o, r)));
});
function th(e) {
  return new Jd({
    type: "function",
    input: Array.isArray(e?.input) ? $d(e?.input) : (e?.input ?? Zn(Tt())),
    output: e?.output ?? Tt(),
  });
}
var Mn = p("ZodCustom", (e, t) => {
  (sc.init(e, t),
    L.init(e, t),
    (e._zod.processJSONSchema = (n, o, r) => kl(e, n, o, r)));
});
function rh(e) {
  let t = new Y({ check: "custom" });
  return ((t._zod.check = e), t);
}
function nh(e, t) {
  return qc(Mn, e ?? (() => !0), t);
}
function Bd(e, t = {}) {
  return Xc(Mn, e, t);
}
function Kd(e, t) {
  return Hc(e, t);
}
var ih = Yc,
  oh = Qc,
  Wd = p(
    "ZodInstanceOf",
    (e, t) => {
      Mn.init(e, t);
    },
    {
      properties(e, t) {
        return this.check(lr(e, t));
      },
    },
  );
function ah(e, t = {}) {
  let n = new Wd({
    type: "custom",
    check: "custom",
    fn: (o) => o instanceof e,
    abort: !0,
    ...h.normalizeParams(t),
  });
  return (
    (n._zod.bag.Class = e),
    (n._zod.check = (o) => {
      o.value instanceof e ||
        o.issues.push({
          code: "invalid_type",
          expected: e.name,
          input: o.value,
          inst: n,
          path: [...(n._zod.def.path ?? [])],
        });
    }),
    n
  );
}
var sh = (...e) => el({ Codec: Fn, Boolean: Ir, String: kr }, ...e);
function uh(e) {
  let t = Fd(() => zr([An(e), nd(), id(), ud(), Zn(t), _d(An(), t)]));
  return t;
}
function ch(e, t) {
  return new Zd({ type: "pipe", in: ma(e), out: t });
}
var Vx = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom",
};
function Fx(e) {
  te({ customError: e });
}
function Mx() {
  return te().customError;
}
var Gd;
Gd || (Gd = {});
var Jn = {};
Ke(Jn, {
  ZodISODate: () => mt,
  ZodISODateTime: () => ft,
  ZodISODuration: () => gt,
  ZodISOTime: () => pt,
  date: () => Bx,
  datetime: () => Jx,
  duration: () => Wx,
  time: () => Kx,
});
function Jx(e) {
  return Sn(ft, e);
}
function Bx(e) {
  return zn(mt, e);
}
function Kx(e) {
  return Pn(pt, e);
}
function Wx(e) {
  return On(gt, e);
}
var P = { ...Pr, ...Fo, iso: Jn },
  Gx = new Set([
    "$schema",
    "$ref",
    "$defs",
    "definitions",
    "$id",
    "id",
    "$comment",
    "$anchor",
    "$vocabulary",
    "$dynamicRef",
    "$dynamicAnchor",
    "type",
    "enum",
    "const",
    "anyOf",
    "oneOf",
    "allOf",
    "not",
    "properties",
    "required",
    "additionalProperties",
    "patternProperties",
    "propertyNames",
    "minProperties",
    "maxProperties",
    "items",
    "prefixItems",
    "additionalItems",
    "minItems",
    "maxItems",
    "uniqueItems",
    "contains",
    "minContains",
    "maxContains",
    "minLength",
    "maxLength",
    "pattern",
    "format",
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
    "description",
    "default",
    "contentEncoding",
    "contentMediaType",
    "contentSchema",
    "unevaluatedItems",
    "unevaluatedProperties",
    "if",
    "then",
    "else",
    "dependentSchemas",
    "dependentRequired",
    "nullable",
    "readOnly",
  ]);
function qx(e, t) {
  let n = e.$schema;
  return n === "https://json-schema.org/draft/2020-12/schema"
    ? "draft-2020-12"
    : n === "http://json-schema.org/draft-07/schema#"
      ? "draft-7"
      : n === "http://json-schema.org/draft-04/schema#"
        ? "draft-4"
        : (t ?? "draft-2020-12");
}
function lh(e, t) {
  return e.map((n, o) => (o < t ? n : n.optional()));
}
function Xx(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function Hx(e, t) {
  if (!e.startsWith("#"))
    throw new Error(
      "External $ref is not supported, only local refs (#/...) are allowed",
    );
  let n = e.slice(1).split("/").filter(Boolean);
  if (n.length === 0) return t.rootSchema;
  let o = t.version === "draft-2020-12" ? "$defs" : "definitions";
  if (n[0] === o) {
    let r = n[1] === void 0 ? void 0 : Xx(n[1]);
    if (!r || !t.defs[r]) throw new Error(`Reference not found: ${e}`);
    return t.defs[r];
  }
  throw new Error(`Reference not found: ${e}`);
}
function Yx(e, t) {
  return P.transform((o) => o)
    .check((o) => {
      let r = o.value;
      if (typeof r != "object" || r === null || Array.isArray(r)) return;
      let i = Object.getOwnPropertyNames(r);
      if (
        (t.minProperties !== void 0 &&
          i.length < t.minProperties &&
          o.issues.push({
            origin: "object",
            code: "too_small",
            minimum: t.minProperties,
            inclusive: !0,
            message: `Too small: expected object to have >=${t.minProperties} properties`,
            input: r,
            inst: e,
            continue: !0,
          }),
        t.maxProperties !== void 0 &&
          i.length > t.maxProperties &&
          o.issues.push({
            origin: "object",
            code: "too_big",
            maximum: t.maxProperties,
            inclusive: !0,
            message: `Too big: expected object to have <=${t.maxProperties} properties`,
            input: r,
            inst: e,
            continue: !0,
          }),
        t.keySchema)
      )
        for (let a of i) {
          let s = t.keySchema.safeParse(a);
          s.success ||
            o.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: s.error.issues,
              input: a,
              path: [a],
              continue: !0,
            });
        }
    })
    .pipe(e);
}
function qd(e, t) {
  if (e === null) return "z";
  let n = typeof e;
  if (n !== "object") {
    if (n === "number" && Number.isNaN(e)) return null;
    let o = String(e);
    return `${n[0]}${o.length}:${o}`;
  }
  if (t.has(e)) return null;
  t.add(e);
  try {
    if (Array.isArray(e)) {
      let i = [];
      for (let a of e) {
        let s = qd(a, t);
        if (s === null) return null;
        i.push(s);
      }
      return `a${i.length}:[${i.join(",")}]`;
    }
    let o = Object.keys(e).sort(),
      r = [];
    for (let i of o) {
      let a = qd(e[i], t);
      if (a === null) return null;
      r.push(`${i.length}:${i}=${a}`);
    }
    return `o${r.length}:{${r.join(",")}}`;
  } finally {
    t.delete(e);
  }
}
var Qx = new Set([
    "items",
    "prefixItems",
    "additionalItems",
    "additionalProperties",
    "contains",
    "propertyNames",
    "not",
    "if",
    "then",
    "else",
    "allOf",
    "anyOf",
    "oneOf",
    "unevaluatedItems",
    "unevaluatedProperties",
    "contentSchema",
  ]),
  ek = new Set([
    "properties",
    "patternProperties",
    "dependentSchemas",
    "dependencies",
    "$defs",
    "definitions",
  ]);
function Bn(e) {
  return typeof e != "object" || e === null
    ? !1
    : Array.isArray(e)
      ? e.some(Bn)
      : typeof e.$ref == "string"
        ? !0
        : Object.entries(e).some(([t, n]) =>
            Qx.has(t)
              ? Bn(n)
              : !ek.has(t) || typeof n != "object" || n === null
                ? !1
                : Object.values(n).some(Bn),
          );
}
function dh(e) {
  return e === 1 ? "element" : "elements";
}
function tk(e, t) {
  return P.transform((o) => o)
    .check((o) => {
      let r = o.value;
      if (Array.isArray(r)) {
        if (t.uniqueItems === !0) {
          let i = new Map();
          for (let a = 0; a < r.length; a++) {
            let s = qd(r[a], new Set());
            if (s === null) continue;
            let c = i.get(s);
            if (c === void 0) {
              i.set(s, a);
              continue;
            }
            o.issues.push({
              code: "custom",
              message: `Array items must be unique: element at index ${a} duplicates the one at index ${c}`,
              input: r,
              path: [a],
              continue: !0,
            });
          }
        }
        if (t.containsSchema) {
          let i = t.minContains ?? 1,
            a =
              t.maxContains !== void 0
                ? t.maxContains + 1
                : Number.POSITIVE_INFINITY,
            s = 0;
          for (let c of r)
            if (t.containsSchema.safeParse(c).success && ++s >= a) break;
          (s < i &&
            o.issues.push({
              code: "custom",
              message: `Array must contain at least ${i} matching ${dh(i)}; found ${s}`,
              input: r,
              continue: !0,
            }),
            t.maxContains !== void 0 &&
              s > t.maxContains &&
              o.issues.push({
                code: "custom",
                message: `Array must contain at most ${t.maxContains} matching ${dh(t.maxContains)}`,
                input: r,
                continue: !0,
              }));
        }
      }
    })
    .pipe(e);
}
function fh(e, t) {
  if (e !== !1) return e === void 0 || e === !0 ? P.any() : ge(e, t);
}
var rk =
  /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
function mh(e, t) {
  if (e.not !== void 0) {
    if (typeof e.not == "object" && Object.keys(e.not).length === 0)
      return P.never();
    throw new Error(
      "not is not supported in Zod (except { not: {} } for never)",
    );
  }
  if (e.unevaluatedItems !== void 0)
    throw new Error("unevaluatedItems is not supported");
  if (e.unevaluatedProperties !== void 0)
    throw new Error("unevaluatedProperties is not supported");
  if (e.if !== void 0 || e.then !== void 0 || e.else !== void 0)
    throw new Error("Conditional schemas (if/then/else) are not supported");
  if (e.dependentSchemas !== void 0 || e.dependentRequired !== void 0)
    throw new Error("dependentSchemas and dependentRequired are not supported");
  if (e.$ref) {
    let r = e.$ref;
    if (t.refs.has(r)) return t.refs.get(r);
    if (t.processing.has(r))
      return P.lazy(() => {
        if (!t.refs.has(r))
          throw new Error(`Circular reference not resolved: ${r}`);
        return t.refs.get(r);
      });
    t.processing.add(r);
    let i = Hx(r, t),
      a = ge(i, t);
    return (t.refs.set(r, a), t.processing.delete(r), a);
  }
  if (e.enum !== void 0) {
    let r = e.enum;
    if (
      t.version === "openapi-3.0" &&
      e.nullable === !0 &&
      r.length === 1 &&
      r[0] === null
    )
      return P.null();
    if (r.length === 0) return P.never();
    if (r.length === 1) return P.literal(r[0]);
    if (r.every((a) => typeof a == "string")) return P.enum(r);
    let i = r.map((a) => P.literal(a));
    return i.length < 2 ? i[0] : P.union([i[0], i[1], ...i.slice(2)]);
  }
  if (e.const !== void 0) return P.literal(e.const);
  let n = e.type;
  if (Array.isArray(n)) {
    let r = n.map((i) => {
      let a = { ...e, type: i };
      return mh(a, t);
    });
    return r.length === 0 ? P.never() : r.length === 1 ? r[0] : P.union(r);
  }
  if (!n) return P.any();
  let o;
  switch (n) {
    case "string": {
      let r = P.string();
      if (e.format) {
        let i = e.format;
        i === "email"
          ? (r = r.check(P.email()))
          : i === "uri" || i === "uri-reference"
            ? (r = r.check(P.url()))
            : i === "uuid" || i === "guid"
              ? (r = r.check(P.uuid()))
              : i === "date-time"
                ? (r = r.check(P.iso.datetime({ offset: !0 })))
                : i === "date"
                  ? (r = r.check(P.iso.date()))
                  : i === "time"
                    ? (r = r.check(P.regex(rk)))
                    : i === "duration"
                      ? (r = r.check(P.iso.duration()))
                      : i === "hostname"
                        ? (r = r.check(P.hostname()))
                        : i === "ipv4"
                          ? (r = r.check(P.ipv4()))
                          : i === "ipv6"
                            ? (r = r.check(P.ipv6()))
                            : i === "mac"
                              ? (r = r.check(P.mac()))
                              : i === "cidr"
                                ? (r = r.check(P.cidrv4()))
                                : i === "cidr-v6"
                                  ? (r = r.check(P.cidrv6()))
                                  : i === "base64"
                                    ? (r = r.check(P.base64()))
                                    : i === "base64url"
                                      ? (r = r.check(P.base64url()))
                                      : i === "e164"
                                        ? (r = r.check(P.e164()))
                                        : i === "credit_card"
                                          ? (r = r.check(P.creditCard()))
                                          : i === "iban"
                                            ? (r = r.check(P.iban()))
                                            : i === "jwt"
                                              ? (r = r.check(P.jwt()))
                                              : i === "emoji"
                                                ? (r = r.check(P.emoji()))
                                                : i === "nanoid"
                                                  ? (r = r.check(P.nanoid()))
                                                  : i === "cuid"
                                                    ? (r = r.check(P.cuid()))
                                                    : i === "cuid2"
                                                      ? (r = r.check(P.cuid2()))
                                                      : i === "ulid"
                                                        ? (r = r.check(
                                                            P.ulid(),
                                                          ))
                                                        : i === "xid"
                                                          ? (r = r.check(
                                                              P.xid(),
                                                            ))
                                                          : i === "ksuid" &&
                                                            (r = r.check(
                                                              P.ksuid(),
                                                            ));
      }
      (typeof e.minLength == "number" && (r = r.min(e.minLength)),
        typeof e.maxLength == "number" && (r = r.max(e.maxLength)),
        e.pattern && (r = r.regex(new RegExp(e.pattern))),
        (o = r));
      break;
    }
    case "number":
    case "integer": {
      let r = n === "integer" ? P.number().int() : P.number();
      (typeof e.minimum == "number" &&
        e.exclusiveMinimum !== !0 &&
        (r = r.min(e.minimum)),
        typeof e.maximum == "number" &&
          e.exclusiveMaximum !== !0 &&
          (r = r.max(e.maximum)),
        typeof e.exclusiveMinimum == "number"
          ? (r = r.gt(e.exclusiveMinimum))
          : e.exclusiveMinimum === !0 &&
            typeof e.minimum == "number" &&
            (r = r.gt(e.minimum)),
        typeof e.exclusiveMaximum == "number"
          ? (r = r.lt(e.exclusiveMaximum))
          : e.exclusiveMaximum === !0 &&
            typeof e.maximum == "number" &&
            (r = r.lt(e.maximum)),
        typeof e.multipleOf == "number" && (r = r.multipleOf(e.multipleOf)),
        (o = r));
      break;
    }
    case "boolean": {
      o = P.boolean();
      break;
    }
    case "null": {
      o = P.null();
      break;
    }
    case "object": {
      let r = {},
        i = e.properties || {},
        a = new Set(e.required || []),
        s =
          typeof e.additionalProperties == "object"
            ? ge(e.additionalProperties, t)
            : void 0;
      for (let [d, f] of Object.entries(i)) {
        let m = ge(f, t);
        se(r, d, a.has(d) ? m : m.optional());
      }
      if (e.patternProperties) {
        let d = e.patternProperties,
          f = Object.keys(d),
          m = [];
        for (let _ of f) {
          let S = ge(d[_], t),
            T = P.string().regex(new RegExp(_));
          m.push(P.looseRecord(T, S));
        }
        let v = [];
        if (
          (Object.keys(r).length > 0 && v.push(P.object(r).passthrough()),
          v.push(...m),
          v.length === 0)
        )
          o = P.object({}).passthrough();
        else if (v.length === 1) o = v[0];
        else {
          let _ = P.intersection(v[0], v[1]);
          for (let S = 2; S < v.length; S++) _ = P.intersection(_, v[S]);
          o = _;
        }
        if (e.additionalProperties === !1) {
          let _ = Object.keys(r),
            S = f.map((j) => new RegExp(j)),
            T = o;
          o = o.check((j) => {
            if (!Oe(j.value)) return;
            let Z = [];
            for (let B of Object.keys(j.value))
              _.includes(B) || S.some((I) => I.test(B)) || Z.push(B);
            Z.length &&
              j.issues.push({
                code: "unrecognized_keys",
                keys: Z,
                input: j.value,
                inst: T,
              });
          });
        }
      } else {
        let d = P.object(r);
        e.additionalProperties === !1
          ? (o = d.strict())
          : s
            ? (o = d.catchall(s))
            : (o = d.passthrough());
      }
      let c = e.propertyNames !== void 0 && e.propertyNames !== !0,
        u = typeof e.minProperties == "number" ? e.minProperties : void 0,
        l = typeof e.maxProperties == "number" ? e.maxProperties : void 0;
      if (c || u !== void 0 || l !== void 0) {
        let d;
        if (c) {
          let f =
            typeof e.propertyNames == "object" &&
            e.propertyNames.type === void 0
              ? { type: "string", ...e.propertyNames }
              : e.propertyNames;
          d = ge(f, t);
        }
        o = Yx(o, { keySchema: d, minProperties: u, maxProperties: l });
      }
      break;
    }
    case "array": {
      let r = e.prefixItems,
        i = e.items;
      if (r && Array.isArray(r)) {
        let a = typeof e.minItems == "number" ? e.minItems : 0,
          s = r.map((d) => ge(d, t)),
          c = lh(s, a),
          u = Array.isArray(i) ? void 0 : fh(i, t),
          l = P.tuple(c);
        ((o = u ? l.rest(u) : l),
          typeof e.minItems == "number" &&
            (o = o.check(P.minLength(e.minItems))),
          typeof e.maxItems == "number" &&
            (o = o.check(P.maxLength(e.maxItems))));
      } else if (Array.isArray(i)) {
        let a = typeof e.minItems == "number" ? e.minItems : 0,
          s = i.map((d) => ge(d, t)),
          c = lh(s, a),
          u = fh(e.additionalItems, t),
          l = P.tuple(c);
        ((o = u ? l.rest(u) : l),
          typeof e.minItems == "number" &&
            (o = o.check(P.minLength(e.minItems))),
          typeof e.maxItems == "number" &&
            (o = o.check(P.maxLength(e.maxItems))));
      } else if (i !== void 0) {
        let a = ge(i, t),
          s = P.array(a);
        (typeof e.minItems == "number" && (s = s.min(e.minItems)),
          typeof e.maxItems == "number" && (s = s.max(e.maxItems)),
          (o = s));
      } else o = P.array(P.any());
      (e.uniqueItems === !0 || e.contains !== void 0) &&
        (o = tk(o, {
          uniqueItems: e.uniqueItems === !0,
          containsSchema: e.contains !== void 0 ? ge(e.contains, t) : void 0,
          minContains:
            typeof e.minContains == "number" ? e.minContains : void 0,
          maxContains:
            typeof e.maxContains == "number" ? e.maxContains : void 0,
        }));
      break;
    }
    default:
      throw new Error(`Unsupported type: ${n}`);
  }
  return o;
}
function ge(e, t) {
  if (typeof e == "boolean") return e ? P.any() : P.never();
  let n = mh(e, t),
    o = e.type || e.enum !== void 0 || e.const !== void 0;
  if (e.anyOf && Array.isArray(e.anyOf)) {
    let s = e.anyOf.map((u) => ge(u, t)),
      c = P.union(s);
    n = o ? P.intersection(n, c) : c;
  }
  if (e.oneOf && Array.isArray(e.oneOf)) {
    let s = e.oneOf.map((u) => ge(u, t)),
      c = P.xor(s);
    n = o ? P.intersection(n, c) : c;
  }
  if (e.allOf && Array.isArray(e.allOf))
    if (e.allOf.length === 0) n = o ? n : P.any();
    else {
      let s = o ? n : ge(e.allOf[0], t),
        c = o ? 0 : 1;
      for (let u = c; u < e.allOf.length; u++)
        s = P.intersection(s, ge(e.allOf[u], t));
      n = s;
    }
  (e.nullable === !0 && t.version === "openapi-3.0" && (n = P.nullable(n)),
    e.readOnly === !0 && (n = P.readonly(n)),
    e.default !== void 0 && (n = n.default(e.default)));
  let r = {},
    i = [
      "$id",
      "id",
      "$comment",
      "$anchor",
      "$vocabulary",
      "$dynamicRef",
      "$dynamicAnchor",
    ];
  for (let s of i) s in e && (r[s] = e[s]);
  let a = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (let s of a) s in e && (r[s] = e[s]);
  if (e.type === "object" && e.$ref === void 0) {
    e.propertyNames !== void 0 &&
      !Bn(e.propertyNames) &&
      (r.propertyNames = e.propertyNames);
    for (let s of ["minProperties", "maxProperties"])
      e[s] !== void 0 && (r[s] = e[s]);
  }
  if (e.type === "array" && e.$ref === void 0) {
    e.contains !== void 0 && !Bn(e.contains) && (r.contains = e.contains);
    for (let s of ["uniqueItems", "minContains", "maxContains"])
      e[s] !== void 0 && (r[s] = e[s]);
  }
  for (let s of Object.keys(e)) Gx.has(s) || se(r, s, e[s]);
  return (
    Object.keys(r).length > 0 && t.registry.add(n, r),
    e.description && (n = n.describe(e.description)),
    n
  );
}
function ph(e, t) {
  if (typeof e == "boolean") return e ? P.any() : P.never();
  let n;
  try {
    n = JSON.parse(JSON.stringify(e));
  } catch {
    throw new Error(
      "fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas",
    );
  }
  let o = qx(n, t?.defaultTarget),
    r = n.$defs || n.definitions || {},
    i = {
      version: o,
      defs: r,
      refs: new Map(),
      processing: new Set(),
      rootSchema: n,
      registry: t?.registry ?? ue,
    };
  return ge(n, i);
}
var gh = Symbol("z.visit/resolving");
function Kn(e, t) {
  let n =
      typeof t == "function"
        ? t
        : (a, s) => {
            let c = t[a._zod.def.type];
            return c ? c(a, s) : a;
          },
    o = new Map();
  function r(a) {
    let s = o.get(a);
    if (s === gh) return new $n({ type: "lazy", getter: () => o.get(a) });
    if (s !== void 0) return s;
    o.set(a, gh);
    let c = i(a),
      u = n(c, c !== a);
    return (o.set(a, u), u);
  }
  function i(a) {
    let s = a._zod.def,
      c = s.type;
    switch (c) {
      case "object": {
        let u = s.shape,
          l = Object.keys(u),
          d = !1,
          f = {};
        for (let v of l) {
          let _ = r(u[v]);
          (_ !== u[v] && (d = !0), (f[v] = _));
        }
        let m = s.catchall;
        return (
          s.catchall && ((m = r(s.catchall)), m !== s.catchall && (d = !0)),
          d ? W(a, { ...s, shape: f, catchall: m }) : a
        );
      }
      case "array": {
        let u = r(s.element);
        return u === s.element ? a : W(a, { ...s, element: u });
      }
      case "tuple": {
        let u = s.items,
          l = !1,
          d = [];
        for (let m of u) {
          let v = r(m);
          (v !== m && (l = !0), d.push(v));
        }
        let f = s.rest;
        return (
          s.rest && ((f = r(s.rest)), f !== s.rest && (l = !0)),
          l ? W(a, { ...s, items: d, rest: f }) : a
        );
      }
      case "record":
      case "map": {
        let u = r(s.keyType),
          l = r(s.valueType);
        return u === s.keyType && l === s.valueType
          ? a
          : W(a, { ...s, keyType: u, valueType: l });
      }
      case "set": {
        let u = r(s.valueType);
        return u === s.valueType ? a : W(a, { ...s, valueType: u });
      }
      case "union": {
        let u = s.options,
          l = !1,
          d = [];
        for (let f of u) {
          let m = r(f);
          (m !== f && (l = !0), d.push(m));
        }
        return l ? W(a, { ...s, options: d }) : a;
      }
      case "intersection": {
        let u = r(s.left),
          l = r(s.right);
        return u === s.left && l === s.right
          ? a
          : W(a, { ...s, left: u, right: l });
      }
      case "optional":
      case "nullable":
      case "default":
      case "prefault":
      case "catch":
      case "readonly":
      case "nonoptional":
      case "promise":
      case "success": {
        let u = r(s.innerType);
        return u === s.innerType ? a : W(a, { ...s, innerType: u });
      }
      case "pipe": {
        let u = r(s.in),
          l = r(s.out);
        return u === s.in && l === s.out ? a : W(a, { ...s, in: u, out: l });
      }
      case "function": {
        let u = r(s.input),
          l = r(s.output);
        return u === s.input && l === s.output
          ? a
          : W(a, { ...s, input: u, output: l });
      }
      case "lazy": {
        let u = s.getter,
          { _cachedInner: l, ...d } = s;
        return W(a, { ...d, getter: () => r(u()) });
      }
      case "template_literal":
      case "string":
      case "number":
      case "int":
      case "boolean":
      case "bigint":
      case "symbol":
      case "undefined":
      case "null":
      case "void":
      case "never":
      case "any":
      case "unknown":
      case "date":
      case "nan":
      case "enum":
      case "literal":
      case "file":
      case "transform":
      case "custom":
        return a;
      default:
        return a;
    }
  }
  return r(e);
}
function vh(e) {
  return Kn(e, {
    object: (t) => t.partial(),
    union: (t) => {
      let n = t._zod.def;
      return n.discriminator === void 0 ? t : zr(n.options);
    },
  });
}
function nk(e, t) {
  if (!t?.length) return e;
  let n = e._zod.def;
  return W(e, Ae(n, { checks: [...(n.checks ?? []), ...t] }), { parent: !0 });
}
function hh(e) {
  return nk(e.out, e.checks);
}
function ik(e) {
  return e.in._zod.traits.has("$ZodTransform") ? hh(e) : e.in;
}
function yh(e) {
  return Kn(e, {
    pipe: (t) => ik(t._zod.def),
    default: (t, n) => (n ? At(t._zod.def.innerType) : t),
    catch: (t, n) => (n ? t._zod.def.innerType : t),
  });
}
function $h(e) {
  return Kn(e, {
    pipe: (t) => hh(t._zod.def),
    prefault: (t, n) => (n ? t._zod.def.innerType : t),
  });
}
var Xd = {};
Ke(Xd, {
  bigint: () => uk,
  boolean: () => sk,
  date: () => ck,
  number: () => ak,
  string: () => ok,
});
function ok(e) {
  return $c(kr, e);
}
function ak(e) {
  return Ic(wr, e);
}
function sk(e) {
  return Tc(Ir, e);
}
function uk(e) {
  return Dc(Sr, e);
}
function ck(e) {
  return Bc(En, e);
}
var J;
(function (e) {
  e.assertEqual = (r) => {};
  function t(r) {}
  e.assertIs = t;
  function n(r) {
    throw new Error();
  }
  ((e.assertNever = n),
    (e.arrayToEnum = (r) => {
      let i = {};
      for (let a of r) i[a] = a;
      return i;
    }),
    (e.getValidEnumValues = (r) => {
      let i = e.objectKeys(r).filter((s) => typeof r[r[s]] != "number"),
        a = {};
      for (let s of i) a[s] = r[s];
      return e.objectValues(a);
    }),
    (e.objectValues = (r) =>
      e.objectKeys(r).map(function (i) {
        return r[i];
      })),
    (e.objectKeys =
      typeof Object.keys == "function"
        ? (r) => Object.keys(r)
        : (r) => {
            let i = [];
            for (let a in r)
              Object.prototype.hasOwnProperty.call(r, a) && i.push(a);
            return i;
          }),
    (e.find = (r, i) => {
      for (let a of r) if (i(a)) return a;
    }),
    (e.isInteger =
      typeof Number.isInteger == "function"
        ? (r) => Number.isInteger(r)
        : (r) =>
            typeof r == "number" && Number.isFinite(r) && Math.floor(r) === r));
  function o(r, i = " | ") {
    return r.map((a) => (typeof a == "string" ? `'${a}'` : a)).join(i);
  }
  ((e.joinValues = o),
    (e.jsonStringifyReplacer = (r, i) =>
      typeof i == "bigint" ? i.toString() : i));
})(J || (J = {}));
var bh;
(function (e) {
  e.mergeShapes = (t, n) => ({ ...t, ...n });
})(bh || (bh = {}));
var O = J.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
  ]),
  Ye = (e) => {
    switch (typeof e) {
      case "undefined":
        return O.undefined;
      case "string":
        return O.string;
      case "number":
        return Number.isNaN(e) ? O.nan : O.number;
      case "boolean":
        return O.boolean;
      case "function":
        return O.function;
      case "bigint":
        return O.bigint;
      case "symbol":
        return O.symbol;
      case "object":
        return Array.isArray(e)
          ? O.array
          : e === null
            ? O.null
            : e.then &&
                typeof e.then == "function" &&
                e.catch &&
                typeof e.catch == "function"
              ? O.promise
              : typeof Map < "u" && e instanceof Map
                ? O.map
                : typeof Set < "u" && e instanceof Set
                  ? O.set
                  : typeof Date < "u" && e instanceof Date
                    ? O.date
                    : O.object;
      default:
        return O.unknown;
    }
  };
var x = J.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite",
]);
var Ie = class e extends Error {
  get errors() {
    return this.issues;
  }
  constructor(t) {
    (super(),
      (this.issues = []),
      (this.addIssue = (o) => {
        this.issues = [...this.issues, o];
      }),
      (this.addIssues = (o = []) => {
        this.issues = [...this.issues, ...o];
      }));
    let n = new.target.prototype;
    (Object.setPrototypeOf
      ? Object.setPrototypeOf(this, n)
      : (this.__proto__ = n),
      (this.name = "ZodError"),
      (this.issues = t));
  }
  format(t) {
    let n =
        t ||
        function (i) {
          return i.message;
        },
      o = { _errors: [] },
      r = (i) => {
        for (let a of i.issues)
          if (a.code === "invalid_union") a.unionErrors.map(r);
          else if (a.code === "invalid_return_type") r(a.returnTypeError);
          else if (a.code === "invalid_arguments") r(a.argumentsError);
          else if (a.path.length === 0) o._errors.push(n(a));
          else {
            let s = o,
              c = 0;
            for (; c < a.path.length;) {
              let u = a.path[c],
                l = c === a.path.length - 1;
              if (u === "_errors") {
                (l && s._errors.push(n(a)), c++);
                continue;
              }
              (Object.prototype.hasOwnProperty.call(s, u) ||
                (u === "__proto__"
                  ? Object.defineProperty(s, u, {
                      value: { _errors: [] },
                      writable: !0,
                      enumerable: !0,
                      configurable: !0,
                    })
                  : (s[u] = { _errors: [] })),
                (s = s[u]),
                l && s._errors.push(n(a)),
                c++);
            }
          }
      };
    return (r(this), o);
  }
  static assert(t) {
    if (!(t instanceof e)) throw new Error(`Not a ZodError: ${t}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, J.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(t = (n) => n.message) {
    let n = Object.create(null),
      o = [];
    for (let r of this.issues)
      if (r.path.length > 0) {
        let i = r.path[0];
        ((n[i] = n[i] || []), n[i].push(t(r)));
      } else o.push(t(r));
    return { formErrors: o, fieldErrors: n };
  }
  get formErrors() {
    return this.flatten();
  }
};
Ie.create = (e) => new Ie(e);
var lk = (e, t) => {
    let n;
    switch (e.code) {
      case x.invalid_type:
        e.received === O.undefined
          ? (n = "Required")
          : (n = `Expected ${e.expected}, received ${e.received}`);
        break;
      case x.invalid_literal:
        n = `Invalid literal value, expected ${JSON.stringify(e.expected, J.jsonStringifyReplacer)}`;
        break;
      case x.unrecognized_keys:
        n = `Unrecognized key(s) in object: ${J.joinValues(e.keys, ", ")}`;
        break;
      case x.invalid_union:
        n = "Invalid input";
        break;
      case x.invalid_union_discriminator:
        n = `Invalid discriminator value. Expected ${J.joinValues(e.options)}`;
        break;
      case x.invalid_enum_value:
        n = `Invalid enum value. Expected ${J.joinValues(e.options)}, received '${e.received}'`;
        break;
      case x.invalid_arguments:
        n = "Invalid function arguments";
        break;
      case x.invalid_return_type:
        n = "Invalid function return type";
        break;
      case x.invalid_date:
        n = "Invalid date";
        break;
      case x.invalid_string:
        typeof e.validation == "object"
          ? "includes" in e.validation
            ? ((n = `Invalid input: must include "${e.validation.includes}"`),
              typeof e.validation.position == "number" &&
                (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`))
            : "startsWith" in e.validation
              ? (n = `Invalid input: must start with "${e.validation.startsWith}"`)
              : "endsWith" in e.validation
                ? (n = `Invalid input: must end with "${e.validation.endsWith}"`)
                : J.assertNever(e.validation)
          : e.validation !== "regex"
            ? (n = `Invalid ${e.validation}`)
            : (n = "Invalid");
        break;
      case x.too_small:
        e.type === "array"
          ? (n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)`)
          : e.type === "string"
            ? (n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)`)
            : e.type === "number"
              ? (n = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}`)
              : e.type === "bigint"
                ? (n = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}`)
                : e.type === "date"
                  ? (n = `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}`)
                  : (n = "Invalid input");
        break;
      case x.too_big:
        e.type === "array"
          ? (n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)`)
          : e.type === "string"
            ? (n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)`)
            : e.type === "number"
              ? (n = `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}`)
              : e.type === "bigint"
                ? (n = `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}`)
                : e.type === "date"
                  ? (n = `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}`)
                  : (n = "Invalid input");
        break;
      case x.custom:
        n = "Invalid input";
        break;
      case x.invalid_intersection_types:
        n = "Intersection results could not be merged";
        break;
      case x.not_multiple_of:
        n = `Number must be a multiple of ${e.multipleOf}`;
        break;
      case x.not_finite:
        n = "Number must be finite";
        break;
      default:
        ((n = t.defaultError), J.assertNever(e));
    }
    return { message: n };
  },
  vt = lk;
var dk = vt;
function Wn() {
  return dk;
}
var va = (e) => {
  let { data: t, path: n, errorMaps: o, issueData: r } = e,
    i = [...n, ...(r.path || [])],
    a = { ...r, path: i };
  if (r.message !== void 0) return { ...r, path: i, message: r.message };
  let s = "",
    c = o
      .filter((u) => !!u)
      .slice()
      .reverse();
  for (let u of c) s = u(a, { data: t, defaultError: s }).message;
  return { ...r, path: i, message: s };
};
function z(e, t) {
  let n = Wn(),
    o = va({
      issueData: t,
      data: e.data,
      path: e.path,
      errorMaps: [
        e.common.contextualErrorMap,
        e.schemaErrorMap,
        n,
        n === vt ? void 0 : vt,
      ].filter((r) => !!r),
    });
  e.common.issues.push(o);
}
var le = class e {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      this.value === "valid" && (this.value = "dirty");
    }
    abort() {
      this.value !== "aborted" && (this.value = "aborted");
    }
    static mergeArray(t, n) {
      let o = [];
      for (let r of n) {
        if (r.status === "aborted") return E;
        (r.status === "dirty" && t.dirty(), o.push(r.value));
      }
      return { status: t.value, value: o };
    }
    static async mergeObjectAsync(t, n) {
      let o = [];
      for (let r of n) {
        let i = await r.key,
          a = await r.value;
        o.push({ key: i, value: a });
      }
      return e.mergeObjectSync(t, o);
    }
    static mergeObjectSync(t, n) {
      let o = {};
      for (let r of n) {
        let { key: i, value: a } = r;
        if (i.status === "aborted" || a.status === "aborted") return E;
        (i.status === "dirty" && t.dirty(),
          a.status === "dirty" && t.dirty(),
          i.value !== "__proto__" &&
            (typeof a.value < "u" || r.alwaysSet) &&
            (o[i.value] = a.value));
      }
      return { status: t.value, value: o };
    }
  },
  E = Object.freeze({ status: "aborted" }),
  Or = (e) => ({ status: "dirty", value: e }),
  ve = (e) => ({ status: "valid", value: e }),
  Hd = (e) => e.status === "aborted",
  Yd = (e) => e.status === "dirty",
  Zt = (e) => e.status === "valid",
  Gn = (e) => typeof Promise < "u" && e instanceof Promise;
var N;
(function (e) {
  ((e.errToObj = (t) => (typeof t == "string" ? { message: t } : t || {})),
    (e.toString = (t) => (typeof t == "string" ? t : t?.message)));
})(N || (N = {}));
var Te = class {
    constructor(t, n, o, r) {
      ((this._cachedPath = []),
        (this.parent = t),
        (this.data = n),
        (this._path = o),
        (this._key = r));
    }
    get path() {
      return (
        this._cachedPath.length ||
          (Array.isArray(this._key)
            ? this._cachedPath.push(...this._path, ...this._key)
            : this._cachedPath.push(...this._path, this._key)),
        this._cachedPath
      );
    }
  },
  xh = (e, t) => {
    if (Zt(t)) return { success: !0, data: t.value };
    if (!e.common.issues.length)
      throw new Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error) return this._error;
        let n = new Ie(e.common.issues);
        return ((this._error = n), this._error);
      },
    };
  };
function R(e) {
  if (!e) return {};
  let {
    errorMap: t,
    invalid_type_error: n,
    required_error: o,
    description: r,
  } = e;
  if (t && (n || o))
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`,
    );
  return t
    ? { errorMap: t, description: r }
    : {
        errorMap: (a, s) => {
          let { message: c } = e;
          return a.code === "invalid_enum_value"
            ? { message: c ?? s.defaultError }
            : typeof s.data > "u"
              ? { message: c ?? o ?? s.defaultError }
              : a.code !== "invalid_type"
                ? { message: s.defaultError }
                : { message: c ?? n ?? s.defaultError };
        },
        description: r,
      };
}
var F = class {
    get description() {
      return this._def.description;
    }
    _getType(t) {
      return Ye(t.data);
    }
    _getOrReturnCtx(t, n) {
      return (
        n || {
          common: t.parent.common,
          data: t.data,
          parsedType: Ye(t.data),
          schemaErrorMap: this._def.errorMap,
          path: t.path,
          parent: t.parent,
        }
      );
    }
    _processInputParams(t) {
      return {
        status: new le(),
        ctx: {
          common: t.parent.common,
          data: t.data,
          parsedType: Ye(t.data),
          schemaErrorMap: this._def.errorMap,
          path: t.path,
          parent: t.parent,
        },
      };
    }
    _parseSync(t) {
      let n = this._parse(t);
      if (Gn(n)) throw new Error("Synchronous parse encountered promise.");
      return n;
    }
    _parseAsync(t) {
      let n = this._parse(t);
      return Promise.resolve(n);
    }
    parse(t, n) {
      let o = this.safeParse(t, n);
      if (o.success) return o.data;
      throw o.error;
    }
    safeParse(t, n) {
      let o = {
          common: {
            issues: [],
            async: n?.async ?? !1,
            contextualErrorMap: n?.errorMap,
          },
          path: n?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: t,
          parsedType: Ye(t),
        },
        r = this._parseSync({ data: t, path: o.path, parent: o });
      return xh(o, r);
    }
    "~validate"(t) {
      let n = {
        common: { issues: [], async: !!this["~standard"].async },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: t,
        parsedType: Ye(t),
      };
      if (!this["~standard"].async)
        try {
          let o = this._parseSync({ data: t, path: [], parent: n });
          return Zt(o) ? { value: o.value } : { issues: n.common.issues };
        } catch (o) {
          (o?.message?.toLowerCase()?.includes("encountered") &&
            (this["~standard"].async = !0),
            (n.common = { issues: [], async: !0 }));
        }
      return this._parseAsync({ data: t, path: [], parent: n }).then((o) =>
        Zt(o) ? { value: o.value } : { issues: n.common.issues },
      );
    }
    async parseAsync(t, n) {
      let o = await this.safeParseAsync(t, n);
      if (o.success) return o.data;
      throw o.error;
    }
    async safeParseAsync(t, n) {
      let o = {
          common: { issues: [], contextualErrorMap: n?.errorMap, async: !0 },
          path: n?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: t,
          parsedType: Ye(t),
        },
        r = this._parse({ data: t, path: o.path, parent: o }),
        i = await (Gn(r) ? r : Promise.resolve(r));
      return xh(o, i);
    }
    refine(t, n) {
      let o = (r) =>
        typeof n == "string" || typeof n > "u"
          ? { message: n }
          : typeof n == "function"
            ? n(r)
            : n;
      return this._refinement((r, i) => {
        let a = t(r),
          s = () => i.addIssue({ code: x.custom, ...o(r) });
        return typeof Promise < "u" && a instanceof Promise
          ? a.then((c) => (c ? !0 : (s(), !1)))
          : a
            ? !0
            : (s(), !1);
      });
    }
    refinement(t, n) {
      return this._refinement((o, r) =>
        t(o) ? !0 : (r.addIssue(typeof n == "function" ? n(o, r) : n), !1),
      );
    }
    _refinement(t) {
      return new Ze({
        schema: this,
        typeName: w.ZodEffects,
        effect: { type: "refinement", refinement: t },
      });
    }
    superRefine(t) {
      return this._refinement(t);
    }
    constructor(t) {
      ((this.spa = this.safeParseAsync),
        (this._def = t),
        (this.parse = this.parse.bind(this)),
        (this.safeParse = this.safeParse.bind(this)),
        (this.parseAsync = this.parseAsync.bind(this)),
        (this.safeParseAsync = this.safeParseAsync.bind(this)),
        (this.spa = this.spa.bind(this)),
        (this.refine = this.refine.bind(this)),
        (this.refinement = this.refinement.bind(this)),
        (this.superRefine = this.superRefine.bind(this)),
        (this.optional = this.optional.bind(this)),
        (this.nullable = this.nullable.bind(this)),
        (this.nullish = this.nullish.bind(this)),
        (this.array = this.array.bind(this)),
        (this.promise = this.promise.bind(this)),
        (this.or = this.or.bind(this)),
        (this.and = this.and.bind(this)),
        (this.transform = this.transform.bind(this)),
        (this.brand = this.brand.bind(this)),
        (this.default = this.default.bind(this)),
        (this.catch = this.catch.bind(this)),
        (this.describe = this.describe.bind(this)),
        (this.pipe = this.pipe.bind(this)),
        (this.readonly = this.readonly.bind(this)),
        (this.isNullable = this.isNullable.bind(this)),
        (this.isOptional = this.isOptional.bind(this)),
        (this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: (n) => this["~validate"](n),
        }));
    }
    optional() {
      return Ee.create(this, this._def);
    }
    nullable() {
      return tt.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return yt.create(this);
    }
    promise() {
      return Ct.create(this, this._def);
    }
    or(t) {
      return Dr.create([this, t], this._def);
    }
    and(t) {
      return Ur.create(this, t, this._def);
    }
    transform(t) {
      return new Ze({
        ...R(this._def),
        schema: this,
        typeName: w.ZodEffects,
        effect: { type: "transform", transform: t },
      });
    }
    default(t) {
      let n = typeof t == "function" ? t : () => t;
      return new Rr({
        ...R(this._def),
        innerType: this,
        defaultValue: n,
        typeName: w.ZodDefault,
      });
    }
    brand() {
      return new ha({ typeName: w.ZodBranded, type: this, ...R(this._def) });
    }
    catch(t) {
      let n = typeof t == "function" ? t : () => t;
      return new Vr({
        ...R(this._def),
        innerType: this,
        catchValue: n,
        typeName: w.ZodCatch,
      });
    }
    describe(t) {
      let n = this.constructor;
      return new n({ ...this._def, description: t });
    }
    pipe(t) {
      return ya.create(this, t);
    }
    readonly() {
      return Fr.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  },
  fk = /^c[^\s-]{8,}$/i,
  mk = /^[0-9a-z]+$/,
  pk = /^[0-9A-HJKMNP-TV-Z]{26}$/i,
  gk =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  vk = /^[a-z0-9_-]{21}$/i,
  hk = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  yk =
    /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  $k =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
  _k = "^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$",
  Qd,
  bk =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  xk =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  kk =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  wk =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  Ik = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  Sk = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  kh =
    "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",
  zk = new RegExp(`^${kh}$`);
function wh(e) {
  let t = "[0-5]\\d";
  e.precision
    ? (t = `${t}\\.\\d{${e.precision}}`)
    : e.precision == null && (t = `${t}(\\.\\d+)?`);
  let n = e.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
function Pk(e) {
  return new RegExp(`^${wh(e)}$`);
}
function Ok(e) {
  let t = `${kh}T${wh(e)}`,
    n = [];
  return (
    n.push(e.local ? "Z?" : "Z"),
    e.offset && n.push("([+-]\\d{2}:?\\d{2})"),
    (t = `${t}(${n.join("|")})`),
    new RegExp(`^${t}$`)
  );
}
function jk(e, t) {
  return !!(
    ((t === "v4" || !t) && bk.test(e)) ||
    ((t === "v6" || !t) && kk.test(e))
  );
}
function Nk(e, t) {
  if (!hk.test(e)) return !1;
  try {
    let [n] = e.split(".");
    if (!n) return !1;
    let o = n
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(n.length + ((4 - (n.length % 4)) % 4), "="),
      r = JSON.parse(atob(o));
    return !(
      typeof r != "object" ||
      r === null ||
      ("typ" in r && r?.typ !== "JWT") ||
      !r.alg ||
      (t && r.alg !== t)
    );
  } catch {
    return !1;
  }
}
function Tk(e, t) {
  return !!(
    ((t === "v4" || !t) && xk.test(e)) ||
    ((t === "v6" || !t) && wk.test(e))
  );
}
var Nr = class e extends F {
  _parse(t) {
    if (
      (this._def.coerce && (t.data = String(t.data)),
      this._getType(t) !== O.string)
    ) {
      let i = this._getOrReturnCtx(t);
      return (
        z(i, {
          code: x.invalid_type,
          expected: O.string,
          received: i.parsedType,
        }),
        E
      );
    }
    let o = new le(),
      r;
    for (let i of this._def.checks)
      if (i.kind === "min")
        t.data.length < i.value &&
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            code: x.too_small,
            minimum: i.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "max")
        t.data.length > i.value &&
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            code: x.too_big,
            maximum: i.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "length") {
        let a = t.data.length > i.value,
          s = t.data.length < i.value;
        (a || s) &&
          ((r = this._getOrReturnCtx(t, r)),
          a
            ? z(r, {
                code: x.too_big,
                maximum: i.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: i.message,
              })
            : s &&
              z(r, {
                code: x.too_small,
                minimum: i.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: i.message,
              }),
          o.dirty());
      } else if (i.kind === "email")
        $k.test(t.data) ||
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            validation: "email",
            code: x.invalid_string,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "emoji")
        (Qd || (Qd = new RegExp(_k, "u")),
          Qd.test(t.data) ||
            ((r = this._getOrReturnCtx(t, r)),
            z(r, {
              validation: "emoji",
              code: x.invalid_string,
              message: i.message,
            }),
            o.dirty()));
      else if (i.kind === "uuid")
        gk.test(t.data) ||
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            validation: "uuid",
            code: x.invalid_string,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "nanoid")
        vk.test(t.data) ||
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            validation: "nanoid",
            code: x.invalid_string,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "cuid")
        fk.test(t.data) ||
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            validation: "cuid",
            code: x.invalid_string,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "cuid2")
        mk.test(t.data) ||
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            validation: "cuid2",
            code: x.invalid_string,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "ulid")
        pk.test(t.data) ||
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            validation: "ulid",
            code: x.invalid_string,
            message: i.message,
          }),
          o.dirty());
      else if (i.kind === "url")
        try {
          new URL(t.data);
        } catch {
          ((r = this._getOrReturnCtx(t, r)),
            z(r, {
              validation: "url",
              code: x.invalid_string,
              message: i.message,
            }),
            o.dirty());
        }
      else
        i.kind === "regex"
          ? ((i.regex.lastIndex = 0),
            i.regex.test(t.data) ||
              ((r = this._getOrReturnCtx(t, r)),
              z(r, {
                validation: "regex",
                code: x.invalid_string,
                message: i.message,
              }),
              o.dirty()))
          : i.kind === "trim"
            ? (t.data = t.data.trim())
            : i.kind === "includes"
              ? t.data.includes(i.value, i.position) ||
                ((r = this._getOrReturnCtx(t, r)),
                z(r, {
                  code: x.invalid_string,
                  validation: { includes: i.value, position: i.position },
                  message: i.message,
                }),
                o.dirty())
              : i.kind === "toLowerCase"
                ? (t.data = t.data.toLowerCase())
                : i.kind === "toUpperCase"
                  ? (t.data = t.data.toUpperCase())
                  : i.kind === "startsWith"
                    ? t.data.startsWith(i.value) ||
                      ((r = this._getOrReturnCtx(t, r)),
                      z(r, {
                        code: x.invalid_string,
                        validation: { startsWith: i.value },
                        message: i.message,
                      }),
                      o.dirty())
                    : i.kind === "endsWith"
                      ? t.data.endsWith(i.value) ||
                        ((r = this._getOrReturnCtx(t, r)),
                        z(r, {
                          code: x.invalid_string,
                          validation: { endsWith: i.value },
                          message: i.message,
                        }),
                        o.dirty())
                      : i.kind === "datetime"
                        ? Ok(i).test(t.data) ||
                          ((r = this._getOrReturnCtx(t, r)),
                          z(r, {
                            code: x.invalid_string,
                            validation: "datetime",
                            message: i.message,
                          }),
                          o.dirty())
                        : i.kind === "date"
                          ? zk.test(t.data) ||
                            ((r = this._getOrReturnCtx(t, r)),
                            z(r, {
                              code: x.invalid_string,
                              validation: "date",
                              message: i.message,
                            }),
                            o.dirty())
                          : i.kind === "time"
                            ? Pk(i).test(t.data) ||
                              ((r = this._getOrReturnCtx(t, r)),
                              z(r, {
                                code: x.invalid_string,
                                validation: "time",
                                message: i.message,
                              }),
                              o.dirty())
                            : i.kind === "duration"
                              ? yk.test(t.data) ||
                                ((r = this._getOrReturnCtx(t, r)),
                                z(r, {
                                  validation: "duration",
                                  code: x.invalid_string,
                                  message: i.message,
                                }),
                                o.dirty())
                              : i.kind === "ip"
                                ? jk(t.data, i.version) ||
                                  ((r = this._getOrReturnCtx(t, r)),
                                  z(r, {
                                    validation: "ip",
                                    code: x.invalid_string,
                                    message: i.message,
                                  }),
                                  o.dirty())
                                : i.kind === "jwt"
                                  ? Nk(t.data, i.alg) ||
                                    ((r = this._getOrReturnCtx(t, r)),
                                    z(r, {
                                      validation: "jwt",
                                      code: x.invalid_string,
                                      message: i.message,
                                    }),
                                    o.dirty())
                                  : i.kind === "cidr"
                                    ? Tk(t.data, i.version) ||
                                      ((r = this._getOrReturnCtx(t, r)),
                                      z(r, {
                                        validation: "cidr",
                                        code: x.invalid_string,
                                        message: i.message,
                                      }),
                                      o.dirty())
                                    : i.kind === "base64"
                                      ? Ik.test(t.data) ||
                                        ((r = this._getOrReturnCtx(t, r)),
                                        z(r, {
                                          validation: "base64",
                                          code: x.invalid_string,
                                          message: i.message,
                                        }),
                                        o.dirty())
                                      : i.kind === "base64url"
                                        ? Sk.test(t.data) ||
                                          ((r = this._getOrReturnCtx(t, r)),
                                          z(r, {
                                            validation: "base64url",
                                            code: x.invalid_string,
                                            message: i.message,
                                          }),
                                          o.dirty())
                                        : J.assertNever(i);
    return { status: o.value, value: t.data };
  }
  _regex(t, n, o) {
    return this.refinement((r) => t.test(r), {
      validation: n,
      code: x.invalid_string,
      ...N.errToObj(o),
    });
  }
  _addCheck(t) {
    return new e({ ...this._def, checks: [...this._def.checks, t] });
  }
  email(t) {
    return this._addCheck({ kind: "email", ...N.errToObj(t) });
  }
  url(t) {
    return this._addCheck({ kind: "url", ...N.errToObj(t) });
  }
  emoji(t) {
    return this._addCheck({ kind: "emoji", ...N.errToObj(t) });
  }
  uuid(t) {
    return this._addCheck({ kind: "uuid", ...N.errToObj(t) });
  }
  nanoid(t) {
    return this._addCheck({ kind: "nanoid", ...N.errToObj(t) });
  }
  cuid(t) {
    return this._addCheck({ kind: "cuid", ...N.errToObj(t) });
  }
  cuid2(t) {
    return this._addCheck({ kind: "cuid2", ...N.errToObj(t) });
  }
  ulid(t) {
    return this._addCheck({ kind: "ulid", ...N.errToObj(t) });
  }
  base64(t) {
    return this._addCheck({ kind: "base64", ...N.errToObj(t) });
  }
  base64url(t) {
    return this._addCheck({ kind: "base64url", ...N.errToObj(t) });
  }
  jwt(t) {
    return this._addCheck({ kind: "jwt", ...N.errToObj(t) });
  }
  ip(t) {
    return this._addCheck({ kind: "ip", ...N.errToObj(t) });
  }
  cidr(t) {
    return this._addCheck({ kind: "cidr", ...N.errToObj(t) });
  }
  datetime(t) {
    return typeof t == "string"
      ? this._addCheck({
          kind: "datetime",
          precision: null,
          offset: !1,
          local: !1,
          message: t,
        })
      : this._addCheck({
          kind: "datetime",
          precision: typeof t?.precision > "u" ? null : t?.precision,
          offset: t?.offset ?? !1,
          local: t?.local ?? !1,
          ...N.errToObj(t?.message),
        });
  }
  date(t) {
    return this._addCheck({ kind: "date", message: t });
  }
  time(t) {
    return typeof t == "string"
      ? this._addCheck({ kind: "time", precision: null, message: t })
      : this._addCheck({
          kind: "time",
          precision: typeof t?.precision > "u" ? null : t?.precision,
          ...N.errToObj(t?.message),
        });
  }
  duration(t) {
    return this._addCheck({ kind: "duration", ...N.errToObj(t) });
  }
  regex(t, n) {
    return this._addCheck({ kind: "regex", regex: t, ...N.errToObj(n) });
  }
  includes(t, n) {
    return this._addCheck({
      kind: "includes",
      value: t,
      position: n?.position,
      ...N.errToObj(n?.message),
    });
  }
  startsWith(t, n) {
    return this._addCheck({ kind: "startsWith", value: t, ...N.errToObj(n) });
  }
  endsWith(t, n) {
    return this._addCheck({ kind: "endsWith", value: t, ...N.errToObj(n) });
  }
  min(t, n) {
    return this._addCheck({ kind: "min", value: t, ...N.errToObj(n) });
  }
  max(t, n) {
    return this._addCheck({ kind: "max", value: t, ...N.errToObj(n) });
  }
  length(t, n) {
    return this._addCheck({ kind: "length", value: t, ...N.errToObj(n) });
  }
  nonempty(t) {
    return this.min(1, N.errToObj(t));
  }
  trim() {
    return new e({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }],
    });
  }
  toLowerCase() {
    return new e({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }],
    });
  }
  toUpperCase() {
    return new e({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }],
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((t) => t.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((t) => t.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((t) => t.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((t) => t.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((t) => t.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((t) => t.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((t) => t.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((t) => t.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((t) => t.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((t) => t.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((t) => t.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((t) => t.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((t) => t.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((t) => t.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((t) => t.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((t) => t.kind === "base64url");
  }
  get minLength() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxLength() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
};
Nr.create = (e) =>
  new Nr({
    checks: [],
    typeName: w.ZodString,
    coerce: e?.coerce ?? !1,
    ...R(e),
  });
function Ak(e, t) {
  let n = (e.toString().split(".")[1] || "").length,
    o = (t.toString().split(".")[1] || "").length,
    r = n > o ? n : o,
    i = Number.parseInt(e.toFixed(r).replace(".", "")),
    a = Number.parseInt(t.toFixed(r).replace(".", ""));
  return (i % a) / 10 ** r;
}
var qn = class e extends F {
  constructor() {
    (super(...arguments),
      (this.min = this.gte),
      (this.max = this.lte),
      (this.step = this.multipleOf));
  }
  _parse(t) {
    if (
      (this._def.coerce && (t.data = Number(t.data)),
      this._getType(t) !== O.number)
    ) {
      let i = this._getOrReturnCtx(t);
      return (
        z(i, {
          code: x.invalid_type,
          expected: O.number,
          received: i.parsedType,
        }),
        E
      );
    }
    let o,
      r = new le();
    for (let i of this._def.checks)
      i.kind === "int"
        ? J.isInteger(t.data) ||
          ((o = this._getOrReturnCtx(t, o)),
          z(o, {
            code: x.invalid_type,
            expected: "integer",
            received: "float",
            message: i.message,
          }),
          r.dirty())
        : i.kind === "min"
          ? (i.inclusive ? t.data < i.value : t.data <= i.value) &&
            ((o = this._getOrReturnCtx(t, o)),
            z(o, {
              code: x.too_small,
              minimum: i.value,
              type: "number",
              inclusive: i.inclusive,
              exact: !1,
              message: i.message,
            }),
            r.dirty())
          : i.kind === "max"
            ? (i.inclusive ? t.data > i.value : t.data >= i.value) &&
              ((o = this._getOrReturnCtx(t, o)),
              z(o, {
                code: x.too_big,
                maximum: i.value,
                type: "number",
                inclusive: i.inclusive,
                exact: !1,
                message: i.message,
              }),
              r.dirty())
            : i.kind === "multipleOf"
              ? Ak(t.data, i.value) !== 0 &&
                ((o = this._getOrReturnCtx(t, o)),
                z(o, {
                  code: x.not_multiple_of,
                  multipleOf: i.value,
                  message: i.message,
                }),
                r.dirty())
              : i.kind === "finite"
                ? Number.isFinite(t.data) ||
                  ((o = this._getOrReturnCtx(t, o)),
                  z(o, { code: x.not_finite, message: i.message }),
                  r.dirty())
                : J.assertNever(i);
    return { status: r.value, value: t.data };
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, N.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, N.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, N.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, N.toString(n));
  }
  setLimit(t, n, o, r) {
    return new e({
      ...this._def,
      checks: [
        ...this._def.checks,
        { kind: t, value: n, inclusive: o, message: N.toString(r) },
      ],
    });
  }
  _addCheck(t) {
    return new e({ ...this._def, checks: [...this._def.checks, t] });
  }
  int(t) {
    return this._addCheck({ kind: "int", message: N.toString(t) });
  }
  positive(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: N.toString(t),
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: N.toString(t),
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: N.toString(t),
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: N.toString(t),
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: N.toString(n),
    });
  }
  finite(t) {
    return this._addCheck({ kind: "finite", message: N.toString(t) });
  }
  safe(t) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: N.toString(t),
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: N.toString(t),
    });
  }
  get minValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
  get isInt() {
    return !!this._def.checks.find(
      (t) =>
        t.kind === "int" || (t.kind === "multipleOf" && J.isInteger(t.value)),
    );
  }
  get isFinite() {
    let t = null,
      n = null;
    for (let o of this._def.checks) {
      if (o.kind === "finite" || o.kind === "int" || o.kind === "multipleOf")
        return !0;
      o.kind === "min"
        ? (n === null || o.value > n) && (n = o.value)
        : o.kind === "max" && (t === null || o.value < t) && (t = o.value);
    }
    return Number.isFinite(n) && Number.isFinite(t);
  }
};
qn.create = (e) =>
  new qn({
    checks: [],
    typeName: w.ZodNumber,
    coerce: e?.coerce || !1,
    ...R(e),
  });
var Xn = class e extends F {
  constructor() {
    (super(...arguments), (this.min = this.gte), (this.max = this.lte));
  }
  _parse(t) {
    if (this._def.coerce)
      try {
        t.data = BigInt(t.data);
      } catch {
        return this._getInvalidInput(t);
      }
    if (this._getType(t) !== O.bigint) return this._getInvalidInput(t);
    let o,
      r = new le();
    for (let i of this._def.checks)
      i.kind === "min"
        ? (i.inclusive ? t.data < i.value : t.data <= i.value) &&
          ((o = this._getOrReturnCtx(t, o)),
          z(o, {
            code: x.too_small,
            type: "bigint",
            minimum: i.value,
            inclusive: i.inclusive,
            message: i.message,
          }),
          r.dirty())
        : i.kind === "max"
          ? (i.inclusive ? t.data > i.value : t.data >= i.value) &&
            ((o = this._getOrReturnCtx(t, o)),
            z(o, {
              code: x.too_big,
              type: "bigint",
              maximum: i.value,
              inclusive: i.inclusive,
              message: i.message,
            }),
            r.dirty())
          : i.kind === "multipleOf"
            ? t.data % i.value !== BigInt(0) &&
              ((o = this._getOrReturnCtx(t, o)),
              z(o, {
                code: x.not_multiple_of,
                multipleOf: i.value,
                message: i.message,
              }),
              r.dirty())
            : J.assertNever(i);
    return { status: r.value, value: t.data };
  }
  _getInvalidInput(t) {
    let n = this._getOrReturnCtx(t);
    return (
      z(n, {
        code: x.invalid_type,
        expected: O.bigint,
        received: n.parsedType,
      }),
      E
    );
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, N.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, N.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, N.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, N.toString(n));
  }
  setLimit(t, n, o, r) {
    return new e({
      ...this._def,
      checks: [
        ...this._def.checks,
        { kind: t, value: n, inclusive: o, message: N.toString(r) },
      ],
    });
  }
  _addCheck(t) {
    return new e({ ...this._def, checks: [...this._def.checks, t] });
  }
  positive(t) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: N.toString(t),
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: N.toString(t),
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: N.toString(t),
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: N.toString(t),
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: N.toString(n),
    });
  }
  get minValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxValue() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
};
Xn.create = (e) =>
  new Xn({
    checks: [],
    typeName: w.ZodBigInt,
    coerce: e?.coerce ?? !1,
    ...R(e),
  });
var Hn = class extends F {
  _parse(t) {
    if (
      (this._def.coerce && (t.data = !!t.data), this._getType(t) !== O.boolean)
    ) {
      let o = this._getOrReturnCtx(t);
      return (
        z(o, {
          code: x.invalid_type,
          expected: O.boolean,
          received: o.parsedType,
        }),
        E
      );
    }
    return ve(t.data);
  }
};
Hn.create = (e) =>
  new Hn({ typeName: w.ZodBoolean, coerce: e?.coerce || !1, ...R(e) });
var Yn = class e extends F {
  _parse(t) {
    if (
      (this._def.coerce && (t.data = new Date(t.data)),
      this._getType(t) !== O.date)
    ) {
      let i = this._getOrReturnCtx(t);
      return (
        z(i, {
          code: x.invalid_type,
          expected: O.date,
          received: i.parsedType,
        }),
        E
      );
    }
    if (Number.isNaN(t.data.getTime())) {
      let i = this._getOrReturnCtx(t);
      return (z(i, { code: x.invalid_date }), E);
    }
    let o = new le(),
      r;
    for (let i of this._def.checks)
      i.kind === "min"
        ? t.data.getTime() < i.value &&
          ((r = this._getOrReturnCtx(t, r)),
          z(r, {
            code: x.too_small,
            message: i.message,
            inclusive: !0,
            exact: !1,
            minimum: i.value,
            type: "date",
          }),
          o.dirty())
        : i.kind === "max"
          ? t.data.getTime() > i.value &&
            ((r = this._getOrReturnCtx(t, r)),
            z(r, {
              code: x.too_big,
              message: i.message,
              inclusive: !0,
              exact: !1,
              maximum: i.value,
              type: "date",
            }),
            o.dirty())
          : J.assertNever(i);
    return { status: o.value, value: new Date(t.data.getTime()) };
  }
  _addCheck(t) {
    return new e({ ...this._def, checks: [...this._def.checks, t] });
  }
  min(t, n) {
    return this._addCheck({
      kind: "min",
      value: t.getTime(),
      message: N.toString(n),
    });
  }
  max(t, n) {
    return this._addCheck({
      kind: "max",
      value: t.getTime(),
      message: N.toString(n),
    });
  }
  get minDate() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t != null ? new Date(t) : null;
  }
  get maxDate() {
    let t = null;
    for (let n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t != null ? new Date(t) : null;
  }
};
Yn.create = (e) =>
  new Yn({ checks: [], coerce: e?.coerce || !1, typeName: w.ZodDate, ...R(e) });
var Qn = class extends F {
  _parse(t) {
    if (this._getType(t) !== O.symbol) {
      let o = this._getOrReturnCtx(t);
      return (
        z(o, {
          code: x.invalid_type,
          expected: O.symbol,
          received: o.parsedType,
        }),
        E
      );
    }
    return ve(t.data);
  }
};
Qn.create = (e) => new Qn({ typeName: w.ZodSymbol, ...R(e) });
var Tr = class extends F {
  _parse(t) {
    if (this._getType(t) !== O.undefined) {
      let o = this._getOrReturnCtx(t);
      return (
        z(o, {
          code: x.invalid_type,
          expected: O.undefined,
          received: o.parsedType,
        }),
        E
      );
    }
    return ve(t.data);
  }
};
Tr.create = (e) => new Tr({ typeName: w.ZodUndefined, ...R(e) });
var Ar = class extends F {
  _parse(t) {
    if (this._getType(t) !== O.null) {
      let o = this._getOrReturnCtx(t);
      return (
        z(o, {
          code: x.invalid_type,
          expected: O.null,
          received: o.parsedType,
        }),
        E
      );
    }
    return ve(t.data);
  }
};
Ar.create = (e) => new Ar({ typeName: w.ZodNull, ...R(e) });
var ei = class extends F {
  constructor() {
    (super(...arguments), (this._any = !0));
  }
  _parse(t) {
    return ve(t.data);
  }
};
ei.create = (e) => new ei({ typeName: w.ZodAny, ...R(e) });
var ht = class extends F {
  constructor() {
    (super(...arguments), (this._unknown = !0));
  }
  _parse(t) {
    return ve(t.data);
  }
};
ht.create = (e) => new ht({ typeName: w.ZodUnknown, ...R(e) });
var Je = class extends F {
  _parse(t) {
    let n = this._getOrReturnCtx(t);
    return (
      z(n, { code: x.invalid_type, expected: O.never, received: n.parsedType }),
      E
    );
  }
};
Je.create = (e) => new Je({ typeName: w.ZodNever, ...R(e) });
var ti = class extends F {
  _parse(t) {
    if (this._getType(t) !== O.undefined) {
      let o = this._getOrReturnCtx(t);
      return (
        z(o, {
          code: x.invalid_type,
          expected: O.void,
          received: o.parsedType,
        }),
        E
      );
    }
    return ve(t.data);
  }
};
ti.create = (e) => new ti({ typeName: w.ZodVoid, ...R(e) });
var yt = class e extends F {
  _parse(t) {
    let { ctx: n, status: o } = this._processInputParams(t),
      r = this._def;
    if (n.parsedType !== O.array)
      return (
        z(n, {
          code: x.invalid_type,
          expected: O.array,
          received: n.parsedType,
        }),
        E
      );
    if (r.exactLength !== null) {
      let a = n.data.length > r.exactLength.value,
        s = n.data.length < r.exactLength.value;
      (a || s) &&
        (z(n, {
          code: a ? x.too_big : x.too_small,
          minimum: s ? r.exactLength.value : void 0,
          maximum: a ? r.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: r.exactLength.message,
        }),
        o.dirty());
    }
    if (
      (r.minLength !== null &&
        n.data.length < r.minLength.value &&
        (z(n, {
          code: x.too_small,
          minimum: r.minLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: r.minLength.message,
        }),
        o.dirty()),
      r.maxLength !== null &&
        n.data.length > r.maxLength.value &&
        (z(n, {
          code: x.too_big,
          maximum: r.maxLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: r.maxLength.message,
        }),
        o.dirty()),
      n.common.async)
    )
      return Promise.all(
        [...n.data].map((a, s) => r.type._parseAsync(new Te(n, a, n.path, s))),
      ).then((a) => le.mergeArray(o, a));
    let i = [...n.data].map((a, s) =>
      r.type._parseSync(new Te(n, a, n.path, s)),
    );
    return le.mergeArray(o, i);
  }
  get element() {
    return this._def.type;
  }
  min(t, n) {
    return new e({
      ...this._def,
      minLength: { value: t, message: N.toString(n) },
    });
  }
  max(t, n) {
    return new e({
      ...this._def,
      maxLength: { value: t, message: N.toString(n) },
    });
  }
  length(t, n) {
    return new e({
      ...this._def,
      exactLength: { value: t, message: N.toString(n) },
    });
  }
  nonempty(t) {
    return this.min(1, t);
  }
};
yt.create = (e, t) =>
  new yt({
    type: e,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: w.ZodArray,
    ...R(t),
  });
function jr(e) {
  if (e instanceof Se) {
    let t = {};
    for (let n in e.shape) {
      let o = e.shape[n];
      t[n] = Ee.create(jr(o));
    }
    return new Se({ ...e._def, shape: () => t });
  } else
    return e instanceof yt
      ? new yt({ ...e._def, type: jr(e.element) })
      : e instanceof Ee
        ? Ee.create(jr(e.unwrap()))
        : e instanceof tt
          ? tt.create(jr(e.unwrap()))
          : e instanceof et
            ? et.create(e.items.map((t) => jr(t)))
            : e;
}
var Se = class e extends F {
  constructor() {
    (super(...arguments),
      (this._cached = null),
      (this.nonstrict = this.passthrough),
      (this.augment = this.extend));
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let t = this._def.shape(),
      n = J.objectKeys(t);
    return ((this._cached = { shape: t, keys: n }), this._cached);
  }
  _parse(t) {
    if (this._getType(t) !== O.object) {
      let u = this._getOrReturnCtx(t);
      return (
        z(u, {
          code: x.invalid_type,
          expected: O.object,
          received: u.parsedType,
        }),
        E
      );
    }
    let { status: o, ctx: r } = this._processInputParams(t),
      { shape: i, keys: a } = this._getCached(),
      s = [];
    if (!(
      this._def.catchall instanceof Je && this._def.unknownKeys === "strip"
    ))
      for (let u in r.data) a.includes(u) || s.push(u);
    let c = [];
    for (let u of a) {
      let l = i[u],
        d = r.data[u];
      c.push({
        key: { status: "valid", value: u },
        value: l._parse(new Te(r, d, r.path, u)),
        alwaysSet: u in r.data,
      });
    }
    if (this._def.catchall instanceof Je) {
      let u = this._def.unknownKeys;
      if (u === "passthrough")
        for (let l of s)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: r.data[l] },
          });
      else if (u === "strict")
        s.length > 0 &&
          (z(r, { code: x.unrecognized_keys, keys: s }), o.dirty());
      else if (u !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let u = this._def.catchall;
      for (let l of s) {
        let d = r.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: u._parse(new Te(r, d, r.path, l)),
          alwaysSet: l in r.data,
        });
      }
    }
    return r.common.async
      ? Promise.resolve()
          .then(async () => {
            let u = [];
            for (let l of c) {
              let d = await l.key,
                f = await l.value;
              u.push({ key: d, value: f, alwaysSet: l.alwaysSet });
            }
            return u;
          })
          .then((u) => le.mergeObjectSync(o, u))
      : le.mergeObjectSync(o, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(t) {
    return (
      N.errToObj,
      new e({
        ...this._def,
        unknownKeys: "strict",
        ...(t !== void 0
          ? {
              errorMap: (n, o) => {
                let r = this._def.errorMap?.(n, o).message ?? o.defaultError;
                return n.code === "unrecognized_keys"
                  ? { message: N.errToObj(t).message ?? r }
                  : { message: r };
              },
            }
          : {}),
      })
    );
  }
  strip() {
    return new e({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new e({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(t) {
    return new e({
      ...this._def,
      shape: () => ({ ...this._def.shape(), ...t }),
    });
  }
  merge(t) {
    return new e({
      unknownKeys: t._def.unknownKeys,
      catchall: t._def.catchall,
      shape: () => ({ ...this._def.shape(), ...t._def.shape() }),
      typeName: w.ZodObject,
    });
  }
  setKey(t, n) {
    return this.augment({ [t]: n });
  }
  catchall(t) {
    return new e({ ...this._def, catchall: t });
  }
  pick(t) {
    let n = {};
    for (let o of J.objectKeys(t))
      t[o] && this.shape[o] && (n[o] = this.shape[o]);
    return new e({ ...this._def, shape: () => n });
  }
  omit(t) {
    let n = {};
    for (let o of J.objectKeys(this.shape)) t[o] || (n[o] = this.shape[o]);
    return new e({ ...this._def, shape: () => n });
  }
  deepPartial() {
    return jr(this);
  }
  partial(t) {
    let n = {};
    for (let o of J.objectKeys(this.shape)) {
      let r = this.shape[o];
      t && !t[o] ? (n[o] = r) : (n[o] = r.optional());
    }
    return new e({ ...this._def, shape: () => n });
  }
  required(t) {
    let n = {};
    for (let o of J.objectKeys(this.shape))
      if (t && !t[o]) n[o] = this.shape[o];
      else {
        let i = this.shape[o];
        for (; i instanceof Ee;) i = i._def.innerType;
        n[o] = i;
      }
    return new e({ ...this._def, shape: () => n });
  }
  keyof() {
    return Ih(J.objectKeys(this.shape));
  }
};
Se.create = (e, t) =>
  new Se({
    shape: () => e,
    unknownKeys: "strip",
    catchall: Je.create(),
    typeName: w.ZodObject,
    ...R(t),
  });
Se.strictCreate = (e, t) =>
  new Se({
    shape: () => e,
    unknownKeys: "strict",
    catchall: Je.create(),
    typeName: w.ZodObject,
    ...R(t),
  });
Se.lazycreate = (e, t) =>
  new Se({
    shape: e,
    unknownKeys: "strip",
    catchall: Je.create(),
    typeName: w.ZodObject,
    ...R(t),
  });
var Dr = class extends F {
  _parse(t) {
    let { ctx: n } = this._processInputParams(t),
      o = this._def.options;
    function r(i) {
      for (let s of i) if (s.result.status === "valid") return s.result;
      for (let s of i)
        if (s.result.status === "dirty")
          return (n.common.issues.push(...s.ctx.common.issues), s.result);
      let a = i.map((s) => new Ie(s.ctx.common.issues));
      return (z(n, { code: x.invalid_union, unionErrors: a }), E);
    }
    if (n.common.async)
      return Promise.all(
        o.map(async (i) => {
          let a = { ...n, common: { ...n.common, issues: [] }, parent: null };
          return {
            result: await i._parseAsync({
              data: n.data,
              path: n.path,
              parent: a,
            }),
            ctx: a,
          };
        }),
      ).then(r);
    {
      let i,
        a = [];
      for (let c of o) {
        let u = { ...n, common: { ...n.common, issues: [] }, parent: null },
          l = c._parseSync({ data: n.data, path: n.path, parent: u });
        if (l.status === "valid") return l;
        (l.status === "dirty" && !i && (i = { result: l, ctx: u }),
          u.common.issues.length && a.push(u.common.issues));
      }
      if (i) return (n.common.issues.push(...i.ctx.common.issues), i.result);
      let s = a.map((c) => new Ie(c));
      return (z(n, { code: x.invalid_union, unionErrors: s }), E);
    }
  }
  get options() {
    return this._def.options;
  }
};
Dr.create = (e, t) => new Dr({ options: e, typeName: w.ZodUnion, ...R(t) });
var Qe = (e) =>
    e instanceof Er
      ? Qe(e.schema)
      : e instanceof Ze
        ? Qe(e.innerType())
        : e instanceof Zr
          ? [e.value]
          : e instanceof Cr
            ? e.options
            : e instanceof Lr
              ? J.objectValues(e.enum)
              : e instanceof Rr
                ? Qe(e._def.innerType)
                : e instanceof Tr
                  ? [void 0]
                  : e instanceof Ar
                    ? [null]
                    : e instanceof Ee
                      ? [void 0, ...Qe(e.unwrap())]
                      : e instanceof tt
                        ? [null, ...Qe(e.unwrap())]
                        : e instanceof ha || e instanceof Fr
                          ? Qe(e.unwrap())
                          : e instanceof Vr
                            ? Qe(e._def.innerType)
                            : [],
  ef = class e extends F {
    _parse(t) {
      let { ctx: n } = this._processInputParams(t);
      if (n.parsedType !== O.object)
        return (
          z(n, {
            code: x.invalid_type,
            expected: O.object,
            received: n.parsedType,
          }),
          E
        );
      let o = this.discriminator,
        r = n.data[o],
        i = this.optionsMap.get(r);
      return i
        ? n.common.async
          ? i._parseAsync({ data: n.data, path: n.path, parent: n })
          : i._parseSync({ data: n.data, path: n.path, parent: n })
        : (z(n, {
            code: x.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [o],
          }),
          E);
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(t, n, o) {
      let r = new Map();
      for (let i of n) {
        let a = Qe(i.shape[t]);
        if (!a.length)
          throw new Error(
            `A discriminator value for key \`${t}\` could not be extracted from all schema options`,
          );
        for (let s of a) {
          if (r.has(s))
            throw new Error(
              `Discriminator property ${String(t)} has duplicate value ${String(s)}`,
            );
          r.set(s, i);
        }
      }
      return new e({
        typeName: w.ZodDiscriminatedUnion,
        discriminator: t,
        options: n,
        optionsMap: r,
        ...R(o),
      });
    }
  };
function tf(e, t) {
  let n = Ye(e),
    o = Ye(t);
  if (e === t) return { valid: !0, data: e };
  if (n === O.object && o === O.object) {
    let r = J.objectKeys(t),
      i = J.objectKeys(e).filter((s) => r.indexOf(s) !== -1),
      a = { ...e, ...t };
    Object.prototype.hasOwnProperty.call(a, "__proto__") && delete a.__proto__;
    for (let s of i) {
      if (s === "__proto__") continue;
      let c = tf(e[s], t[s]);
      if (!c.valid) return { valid: !1 };
      a[s] = c.data;
    }
    return { valid: !0, data: a };
  } else if (n === O.array && o === O.array) {
    if (e.length !== t.length) return { valid: !1 };
    let r = [];
    for (let i = 0; i < e.length; i++) {
      let a = e[i],
        s = t[i],
        c = tf(a, s);
      if (!c.valid) return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else
    return n === O.date && o === O.date && +e == +t
      ? { valid: !0, data: e }
      : { valid: !1 };
}
var Ur = class extends F {
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t),
      r = (i, a) => {
        if (Hd(i) || Hd(a)) return E;
        let s = tf(i.value, a.value);
        return s.valid
          ? ((Yd(i) || Yd(a)) && n.dirty(), { status: n.value, value: s.data })
          : (z(o, { code: x.invalid_intersection_types }), E);
      };
    return o.common.async
      ? Promise.all([
          this._def.left._parseAsync({ data: o.data, path: o.path, parent: o }),
          this._def.right._parseAsync({
            data: o.data,
            path: o.path,
            parent: o,
          }),
        ]).then(([i, a]) => r(i, a))
      : r(
          this._def.left._parseSync({ data: o.data, path: o.path, parent: o }),
          this._def.right._parseSync({ data: o.data, path: o.path, parent: o }),
        );
  }
};
Ur.create = (e, t, n) =>
  new Ur({ left: e, right: t, typeName: w.ZodIntersection, ...R(n) });
var et = class e extends F {
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== O.array)
      return (
        z(o, {
          code: x.invalid_type,
          expected: O.array,
          received: o.parsedType,
        }),
        E
      );
    if (o.data.length < this._def.items.length)
      return (
        z(o, {
          code: x.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array",
        }),
        E
      );
    !this._def.rest &&
      o.data.length > this._def.items.length &&
      (z(o, {
        code: x.too_big,
        maximum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array",
      }),
      n.dirty());
    let i = [...o.data]
      .map((a, s) => {
        let c = this._def.items[s] || this._def.rest;
        return c ? c._parse(new Te(o, a, o.path, s)) : null;
      })
      .filter((a) => !!a);
    return o.common.async
      ? Promise.all(i).then((a) => le.mergeArray(n, a))
      : le.mergeArray(n, i);
  }
  get items() {
    return this._def.items;
  }
  rest(t) {
    return new e({ ...this._def, rest: t });
  }
};
et.create = (e, t) => {
  if (!Array.isArray(e))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new et({ items: e, typeName: w.ZodTuple, rest: null, ...R(t) });
};
var rf = class e extends F {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(t) {
      let { status: n, ctx: o } = this._processInputParams(t);
      if (o.parsedType !== O.object)
        return (
          z(o, {
            code: x.invalid_type,
            expected: O.object,
            received: o.parsedType,
          }),
          E
        );
      let r = [],
        i = this._def.keyType,
        a = this._def.valueType;
      for (let s in o.data)
        r.push({
          key: i._parse(new Te(o, s, o.path, s)),
          value: a._parse(new Te(o, o.data[s], o.path, s)),
          alwaysSet: s in o.data,
        });
      return o.common.async
        ? le.mergeObjectAsync(n, r)
        : le.mergeObjectSync(n, r);
    }
    get element() {
      return this._def.valueType;
    }
    static create(t, n, o) {
      return n instanceof F
        ? new e({ keyType: t, valueType: n, typeName: w.ZodRecord, ...R(o) })
        : new e({
            keyType: Nr.create(),
            valueType: t,
            typeName: w.ZodRecord,
            ...R(n),
          });
    }
  },
  ri = class extends F {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(t) {
      let { status: n, ctx: o } = this._processInputParams(t);
      if (o.parsedType !== O.map)
        return (
          z(o, {
            code: x.invalid_type,
            expected: O.map,
            received: o.parsedType,
          }),
          E
        );
      let r = this._def.keyType,
        i = this._def.valueType,
        a = [...o.data.entries()].map(([s, c], u) => ({
          key: r._parse(new Te(o, s, o.path, [u, "key"])),
          value: i._parse(new Te(o, c, o.path, [u, "value"])),
        }));
      if (o.common.async) {
        let s = new Map();
        return Promise.resolve().then(async () => {
          for (let c of a) {
            let u = await c.key,
              l = await c.value;
            if (u.status === "aborted" || l.status === "aborted") return E;
            ((u.status === "dirty" || l.status === "dirty") && n.dirty(),
              s.set(u.value, l.value));
          }
          return { status: n.value, value: s };
        });
      } else {
        let s = new Map();
        for (let c of a) {
          let u = c.key,
            l = c.value;
          if (u.status === "aborted" || l.status === "aborted") return E;
          ((u.status === "dirty" || l.status === "dirty") && n.dirty(),
            s.set(u.value, l.value));
        }
        return { status: n.value, value: s };
      }
    }
  };
ri.create = (e, t, n) =>
  new ri({ valueType: t, keyType: e, typeName: w.ZodMap, ...R(n) });
var ni = class e extends F {
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t);
    if (o.parsedType !== O.set)
      return (
        z(o, { code: x.invalid_type, expected: O.set, received: o.parsedType }),
        E
      );
    let r = this._def;
    (r.minSize !== null &&
      o.data.size < r.minSize.value &&
      (z(o, {
        code: x.too_small,
        minimum: r.minSize.value,
        type: "set",
        inclusive: !0,
        exact: !1,
        message: r.minSize.message,
      }),
      n.dirty()),
      r.maxSize !== null &&
        o.data.size > r.maxSize.value &&
        (z(o, {
          code: x.too_big,
          maximum: r.maxSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: r.maxSize.message,
        }),
        n.dirty()));
    let i = this._def.valueType;
    function a(c) {
      let u = new Set();
      for (let l of c) {
        if (l.status === "aborted") return E;
        (l.status === "dirty" && n.dirty(), u.add(l.value));
      }
      return { status: n.value, value: u };
    }
    let s = [...o.data.values()].map((c, u) =>
      i._parse(new Te(o, c, o.path, u)),
    );
    return o.common.async ? Promise.all(s).then((c) => a(c)) : a(s);
  }
  min(t, n) {
    return new e({
      ...this._def,
      minSize: { value: t, message: N.toString(n) },
    });
  }
  max(t, n) {
    return new e({
      ...this._def,
      maxSize: { value: t, message: N.toString(n) },
    });
  }
  size(t, n) {
    return this.min(t, n).max(t, n);
  }
  nonempty(t) {
    return this.min(1, t);
  }
};
ni.create = (e, t) =>
  new ni({
    valueType: e,
    minSize: null,
    maxSize: null,
    typeName: w.ZodSet,
    ...R(t),
  });
var nf = class e extends F {
    constructor() {
      (super(...arguments), (this.validate = this.implement));
    }
    _parse(t) {
      let { ctx: n } = this._processInputParams(t);
      if (n.parsedType !== O.function)
        return (
          z(n, {
            code: x.invalid_type,
            expected: O.function,
            received: n.parsedType,
          }),
          E
        );
      function o(s, c) {
        return va({
          data: s,
          path: n.path,
          errorMaps: [
            n.common.contextualErrorMap,
            n.schemaErrorMap,
            Wn(),
            vt,
          ].filter((u) => !!u),
          issueData: { code: x.invalid_arguments, argumentsError: c },
        });
      }
      function r(s, c) {
        return va({
          data: s,
          path: n.path,
          errorMaps: [
            n.common.contextualErrorMap,
            n.schemaErrorMap,
            Wn(),
            vt,
          ].filter((u) => !!u),
          issueData: { code: x.invalid_return_type, returnTypeError: c },
        });
      }
      let i = { errorMap: n.common.contextualErrorMap },
        a = n.data;
      if (this._def.returns instanceof Ct) {
        let s = this;
        return ve(async function (...c) {
          let u = new Ie([]),
            l = await s._def.args.parseAsync(c, i).catch((m) => {
              throw (u.addIssue(o(c, m)), u);
            }),
            d = await Reflect.apply(a, this, l);
          return await s._def.returns._def.type.parseAsync(d, i).catch((m) => {
            throw (u.addIssue(r(d, m)), u);
          });
        });
      } else {
        let s = this;
        return ve(function (...c) {
          let u = s._def.args.safeParse(c, i);
          if (!u.success) throw new Ie([o(c, u.error)]);
          let l = Reflect.apply(a, this, u.data),
            d = s._def.returns.safeParse(l, i);
          if (!d.success) throw new Ie([r(l, d.error)]);
          return d.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...t) {
      return new e({ ...this._def, args: et.create(t).rest(ht.create()) });
    }
    returns(t) {
      return new e({ ...this._def, returns: t });
    }
    implement(t) {
      return this.parse(t);
    }
    strictImplement(t) {
      return this.parse(t);
    }
    static create(t, n, o) {
      return new e({
        args: t || et.create([]).rest(ht.create()),
        returns: n || ht.create(),
        typeName: w.ZodFunction,
        ...R(o),
      });
    }
  },
  Er = class extends F {
    get schema() {
      return this._def.getter();
    }
    _parse(t) {
      let { ctx: n } = this._processInputParams(t);
      return this._def
        .getter()
        ._parse({ data: n.data, path: n.path, parent: n });
    }
  };
Er.create = (e, t) => new Er({ getter: e, typeName: w.ZodLazy, ...R(t) });
var Zr = class extends F {
  _parse(t) {
    if (t.data !== this._def.value) {
      let n = this._getOrReturnCtx(t);
      return (
        z(n, {
          received: n.data,
          code: x.invalid_literal,
          expected: this._def.value,
        }),
        E
      );
    }
    return { status: "valid", value: t.data };
  }
  get value() {
    return this._def.value;
  }
};
Zr.create = (e, t) => new Zr({ value: e, typeName: w.ZodLiteral, ...R(t) });
function Ih(e, t) {
  return new Cr({ values: e, typeName: w.ZodEnum, ...R(t) });
}
var Cr = class e extends F {
  _parse(t) {
    if (typeof t.data != "string") {
      let n = this._getOrReturnCtx(t),
        o = this._def.values;
      return (
        z(n, {
          expected: J.joinValues(o),
          received: n.parsedType,
          code: x.invalid_type,
        }),
        E
      );
    }
    if (
      (this._cache || (this._cache = new Set(this._def.values)),
      !this._cache.has(t.data))
    ) {
      let n = this._getOrReturnCtx(t),
        o = this._def.values;
      return (
        z(n, { received: n.data, code: x.invalid_enum_value, options: o }),
        E
      );
    }
    return ve(t.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let t = {};
    for (let n of this._def.values) t[n] = n;
    return t;
  }
  get Values() {
    let t = {};
    for (let n of this._def.values) t[n] = n;
    return t;
  }
  get Enum() {
    let t = {};
    for (let n of this._def.values) t[n] = n;
    return t;
  }
  extract(t, n = this._def) {
    return e.create(t, { ...this._def, ...n });
  }
  exclude(t, n = this._def) {
    return e.create(
      this.options.filter((o) => !t.includes(o)),
      { ...this._def, ...n },
    );
  }
};
Cr.create = Ih;
var Lr = class extends F {
  _parse(t) {
    let n = J.getValidEnumValues(this._def.values),
      o = this._getOrReturnCtx(t);
    if (o.parsedType !== O.string && o.parsedType !== O.number) {
      let r = J.objectValues(n);
      return (
        z(o, {
          expected: J.joinValues(r),
          received: o.parsedType,
          code: x.invalid_type,
        }),
        E
      );
    }
    if (
      (this._cache ||
        (this._cache = new Set(J.getValidEnumValues(this._def.values))),
      !this._cache.has(t.data))
    ) {
      let r = J.objectValues(n);
      return (
        z(o, { received: o.data, code: x.invalid_enum_value, options: r }),
        E
      );
    }
    return ve(t.data);
  }
  get enum() {
    return this._def.values;
  }
};
Lr.create = (e, t) => new Lr({ values: e, typeName: w.ZodNativeEnum, ...R(t) });
var Ct = class extends F {
  unwrap() {
    return this._def.type;
  }
  _parse(t) {
    let { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== O.promise && n.common.async === !1)
      return (
        z(n, {
          code: x.invalid_type,
          expected: O.promise,
          received: n.parsedType,
        }),
        E
      );
    let o = n.parsedType === O.promise ? n.data : Promise.resolve(n.data);
    return ve(
      o.then((r) =>
        this._def.type.parseAsync(r, {
          path: n.path,
          errorMap: n.common.contextualErrorMap,
        }),
      ),
    );
  }
};
Ct.create = (e, t) => new Ct({ type: e, typeName: w.ZodPromise, ...R(t) });
var Ze = class extends F {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === w.ZodEffects
      ? this._def.schema.sourceType()
      : this._def.schema;
  }
  _parse(t) {
    let { status: n, ctx: o } = this._processInputParams(t),
      r = this._def.effect || null,
      i = {
        addIssue: (a) => {
          (z(o, a), a.fatal ? n.abort() : n.dirty());
        },
        get path() {
          return o.path;
        },
      };
    if (((i.addIssue = i.addIssue.bind(i)), r.type === "preprocess")) {
      let a = r.transform(o.data, i);
      if (o.common.async)
        return Promise.resolve(a).then(async (s) => {
          if (n.value === "aborted") return E;
          let c = await this._def.schema._parseAsync({
            data: s,
            path: o.path,
            parent: o,
          });
          return c.status === "aborted"
            ? E
            : c.status === "dirty"
              ? Or(c.value)
              : n.value === "dirty"
                ? Or(c.value)
                : c;
        });
      {
        if (n.value === "aborted") return E;
        let s = this._def.schema._parseSync({
          data: a,
          path: o.path,
          parent: o,
        });
        return s.status === "aborted"
          ? E
          : s.status === "dirty"
            ? Or(s.value)
            : n.value === "dirty"
              ? Or(s.value)
              : s;
      }
    }
    if (r.type === "refinement") {
      let a = (s) => {
        let c = r.refinement(s, i);
        if (o.common.async) return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error(
            "Async refinement encountered during synchronous parse operation. Use .parseAsync instead.",
          );
        return s;
      };
      if (o.common.async === !1) {
        let s = this._def.schema._parseSync({
          data: o.data,
          path: o.path,
          parent: o,
        });
        return s.status === "aborted"
          ? E
          : (s.status === "dirty" && n.dirty(),
            a(s.value),
            { status: n.value, value: s.value });
      } else
        return this._def.schema
          ._parseAsync({ data: o.data, path: o.path, parent: o })
          .then((s) =>
            s.status === "aborted"
              ? E
              : (s.status === "dirty" && n.dirty(),
                a(s.value).then(() => ({ status: n.value, value: s.value }))),
          );
    }
    if (r.type === "transform")
      if (o.common.async === !1) {
        let a = this._def.schema._parseSync({
          data: o.data,
          path: o.path,
          parent: o,
        });
        if (!Zt(a)) return E;
        let s = r.transform(a.value, i);
        if (s instanceof Promise)
          throw new Error(
            "Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.",
          );
        return { status: n.value, value: s };
      } else
        return this._def.schema
          ._parseAsync({ data: o.data, path: o.path, parent: o })
          .then((a) =>
            Zt(a)
              ? Promise.resolve(r.transform(a.value, i)).then((s) => ({
                  status: n.value,
                  value: s,
                }))
              : E,
          );
    J.assertNever(r);
  }
};
Ze.create = (e, t, n) =>
  new Ze({ schema: e, typeName: w.ZodEffects, effect: t, ...R(n) });
Ze.createWithPreprocess = (e, t, n) =>
  new Ze({
    schema: t,
    effect: { type: "preprocess", transform: e },
    typeName: w.ZodEffects,
    ...R(n),
  });
var Ee = class extends F {
  _parse(t) {
    return this._getType(t) === O.undefined
      ? ve(void 0)
      : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Ee.create = (e, t) =>
  new Ee({ innerType: e, typeName: w.ZodOptional, ...R(t) });
var tt = class extends F {
  _parse(t) {
    return this._getType(t) === O.null
      ? ve(null)
      : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
};
tt.create = (e, t) =>
  new tt({ innerType: e, typeName: w.ZodNullable, ...R(t) });
var Rr = class extends F {
  _parse(t) {
    let { ctx: n } = this._processInputParams(t),
      o = n.data;
    return (
      n.parsedType === O.undefined && (o = this._def.defaultValue()),
      this._def.innerType._parse({ data: o, path: n.path, parent: n })
    );
  }
  removeDefault() {
    return this._def.innerType;
  }
};
Rr.create = (e, t) =>
  new Rr({
    innerType: e,
    typeName: w.ZodDefault,
    defaultValue: typeof t.default == "function" ? t.default : () => t.default,
    ...R(t),
  });
var Vr = class extends F {
  _parse(t) {
    let { ctx: n } = this._processInputParams(t),
      o = { ...n, common: { ...n.common, issues: [] } },
      r = this._def.innerType._parse({
        data: o.data,
        path: o.path,
        parent: { ...o },
      });
    return Gn(r)
      ? r.then((i) => ({
          status: "valid",
          value:
            i.status === "valid"
              ? i.value
              : this._def.catchValue({
                  get error() {
                    return new Ie(o.common.issues);
                  },
                  input: o.data,
                }),
        }))
      : {
          status: "valid",
          value:
            r.status === "valid"
              ? r.value
              : this._def.catchValue({
                  get error() {
                    return new Ie(o.common.issues);
                  },
                  input: o.data,
                }),
        };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
Vr.create = (e, t) =>
  new Vr({
    innerType: e,
    typeName: w.ZodCatch,
    catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
    ...R(t),
  });
var ii = class extends F {
  _parse(t) {
    if (this._getType(t) !== O.nan) {
      let o = this._getOrReturnCtx(t);
      return (
        z(o, { code: x.invalid_type, expected: O.nan, received: o.parsedType }),
        E
      );
    }
    return { status: "valid", value: t.data };
  }
};
ii.create = (e) => new ii({ typeName: w.ZodNaN, ...R(e) });
var ha = class extends F {
    _parse(t) {
      let { ctx: n } = this._processInputParams(t),
        o = n.data;
      return this._def.type._parse({ data: o, path: n.path, parent: n });
    }
    unwrap() {
      return this._def.type;
    }
  },
  ya = class e extends F {
    _parse(t) {
      let { status: n, ctx: o } = this._processInputParams(t);
      if (o.common.async)
        return (async () => {
          let i = await this._def.in._parseAsync({
            data: o.data,
            path: o.path,
            parent: o,
          });
          return i.status === "aborted"
            ? E
            : i.status === "dirty"
              ? (n.dirty(), Or(i.value))
              : this._def.out._parseAsync({
                  data: i.value,
                  path: o.path,
                  parent: o,
                });
        })();
      {
        let r = this._def.in._parseSync({
          data: o.data,
          path: o.path,
          parent: o,
        });
        return r.status === "aborted"
          ? E
          : r.status === "dirty"
            ? (n.dirty(), { status: "dirty", value: r.value })
            : this._def.out._parseSync({
                data: r.value,
                path: o.path,
                parent: o,
              });
      }
    }
    static create(t, n) {
      return new e({ in: t, out: n, typeName: w.ZodPipeline });
    }
  },
  Fr = class extends F {
    _parse(t) {
      let n = this._def.innerType._parse(t),
        o = (r) => (Zt(r) && (r.value = Object.freeze(r.value)), r);
      return Gn(n) ? n.then((r) => o(r)) : o(n);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
Fr.create = (e, t) =>
  new Fr({ innerType: e, typeName: w.ZodReadonly, ...R(t) });
var C4 = { object: Se.lazycreate },
  w;
(function (e) {
  ((e.ZodString = "ZodString"),
    (e.ZodNumber = "ZodNumber"),
    (e.ZodNaN = "ZodNaN"),
    (e.ZodBigInt = "ZodBigInt"),
    (e.ZodBoolean = "ZodBoolean"),
    (e.ZodDate = "ZodDate"),
    (e.ZodSymbol = "ZodSymbol"),
    (e.ZodUndefined = "ZodUndefined"),
    (e.ZodNull = "ZodNull"),
    (e.ZodAny = "ZodAny"),
    (e.ZodUnknown = "ZodUnknown"),
    (e.ZodNever = "ZodNever"),
    (e.ZodVoid = "ZodVoid"),
    (e.ZodArray = "ZodArray"),
    (e.ZodObject = "ZodObject"),
    (e.ZodUnion = "ZodUnion"),
    (e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion"),
    (e.ZodIntersection = "ZodIntersection"),
    (e.ZodTuple = "ZodTuple"),
    (e.ZodRecord = "ZodRecord"),
    (e.ZodMap = "ZodMap"),
    (e.ZodSet = "ZodSet"),
    (e.ZodFunction = "ZodFunction"),
    (e.ZodLazy = "ZodLazy"),
    (e.ZodLiteral = "ZodLiteral"),
    (e.ZodEnum = "ZodEnum"),
    (e.ZodEffects = "ZodEffects"),
    (e.ZodNativeEnum = "ZodNativeEnum"),
    (e.ZodOptional = "ZodOptional"),
    (e.ZodNullable = "ZodNullable"),
    (e.ZodDefault = "ZodDefault"),
    (e.ZodCatch = "ZodCatch"),
    (e.ZodPromise = "ZodPromise"),
    (e.ZodBranded = "ZodBranded"),
    (e.ZodPipeline = "ZodPipeline"),
    (e.ZodReadonly = "ZodReadonly"));
})(w || (w = {}));
var L4 = Nr.create,
  R4 = qn.create,
  V4 = ii.create,
  F4 = Xn.create,
  M4 = Hn.create,
  J4 = Yn.create,
  B4 = Qn.create,
  K4 = Tr.create,
  W4 = Ar.create,
  G4 = ei.create,
  q4 = ht.create,
  X4 = Je.create,
  H4 = ti.create,
  Y4 = yt.create,
  Q4 = Se.create,
  eP = Se.strictCreate,
  tP = Dr.create,
  rP = ef.create,
  nP = Ur.create,
  iP = et.create,
  oP = rf.create,
  aP = ri.create,
  sP = ni.create,
  uP = nf.create,
  cP = Er.create,
  lP = Zr.create,
  dP = Cr.create,
  fP = Lr.create,
  mP = Ct.create,
  pP = Ze.create,
  gP = Ee.create,
  vP = tt.create,
  hP = Ze.createWithPreprocess,
  yP = ya.create;
var oi = class extends Error {
    constructor(t, n) {
      (super(t),
        (this.name = "ParseError"),
        (this.type = n.type),
        (this.field = n.field),
        (this.value = n.value),
        (this.line = n.line));
    }
  },
  Sh = 10,
  Dk = 13,
  Lt = 32;
function of(e) {}
function Oh(e) {
  if (typeof e == "function")
    throw new TypeError(
      "`config` must be an object, got a function instead. Did you mean `createParser({onEvent: fn})`?",
    );
  let {
      onEvent: t = of,
      onError: n = of,
      onRetry: o = of,
      onComment: r,
      maxBufferSize: i,
    } = e,
    a = [],
    s = 0,
    c = !0,
    u,
    l = "",
    d = 0,
    f,
    m = !1;
  function v(I) {
    if (m)
      throw new Error(
        "Cannot feed parser: it was terminated after exceeding the configured max buffer size. Call `reset()` to resume parsing.",
      );
    if (
      (c &&
        ((c = !1),
        I.charCodeAt(0) === 239 &&
          I.charCodeAt(1) === 187 &&
          I.charCodeAt(2) === 191 &&
          (I = I.slice(3))),
      a.length === 0)
    ) {
      let ee = S(I);
      (ee !== "" && (a.push(ee), (s = ee.length)), _());
      return;
    }
    if (
      I.indexOf(`
`) === -1 &&
      I.indexOf("\r") === -1
    ) {
      (a.push(I), (s += I.length), _());
      return;
    }
    a.push(I);
    let b = a.join("");
    ((a.length = 0), (s = 0));
    let D = S(b);
    (D !== "" && (a.push(D), (s = D.length)), _());
  }
  function _() {
    i !== void 0 &&
      (s + l.length <= i ||
        ((m = !0),
        (a.length = 0),
        (s = 0),
        (u = void 0),
        (l = ""),
        (d = 0),
        (f = void 0),
        n(
          new oi(`Buffered data exceeded max buffer size of ${i} characters`, {
            type: "max-buffer-size-exceeded",
          }),
        )));
  }
  function S(I) {
    let b = 0;
    if (I.indexOf("\r") === -1) {
      let D = I.indexOf(
        `
`,
        b,
      );
      for (; D !== -1;) {
        if (b === D) {
          (d > 0 && t({ id: u, event: f, data: l }),
            (u = void 0),
            (l = ""),
            (d = 0),
            (f = void 0),
            (b = D + 1),
            (D = I.indexOf(
              `
`,
              b,
            )));
          continue;
        }
        let ee = I.charCodeAt(b);
        if (zh(I, b, ee)) {
          let re = I.charCodeAt(b + 5) === Lt ? b + 6 : b + 5,
            Pe = I.slice(re, D);
          if (d === 0 && I.charCodeAt(D + 1) === Sh) {
            (t({ id: u, event: f, data: Pe }),
              (u = void 0),
              (l = ""),
              (f = void 0),
              (b = D + 2),
              (D = I.indexOf(
                `
`,
                b,
              )));
            continue;
          }
          ((l =
            d === 0
              ? Pe
              : `${l}
${Pe}`),
            d++);
        } else
          Ph(I, b, ee)
            ? (f =
                I.slice(I.charCodeAt(b + 6) === Lt ? b + 7 : b + 6, D) ||
                void 0)
            : T(I, b, D);
        ((b = D + 1),
          (D = I.indexOf(
            `
`,
            b,
          )));
      }
      return I.slice(b);
    }
    for (; b < I.length;) {
      let D = I.indexOf("\r", b),
        ee = I.indexOf(
          `
`,
          b,
        ),
        re = -1;
      if (
        (D !== -1 && ee !== -1
          ? (re = D < ee ? D : ee)
          : D !== -1
            ? D === I.length - 1
              ? (re = -1)
              : (re = D)
            : ee !== -1 && (re = ee),
        re === -1)
      )
        break;
      (T(I, b, re),
        (b = re + 1),
        I.charCodeAt(b - 1) === Dk && I.charCodeAt(b) === Sh && b++);
    }
    return I.slice(b);
  }
  function T(I, b, D) {
    if (b === D) {
      Z();
      return;
    }
    let ee = I.charCodeAt(b);
    if (zh(I, b, ee)) {
      let Vt = I.charCodeAt(b + 5) === Lt ? b + 6 : b + 5,
        mf = I.slice(Vt, D);
      ((l =
        d === 0
          ? mf
          : `${l}
${mf}`),
        d++);
      return;
    }
    if (Ph(I, b, ee)) {
      f = I.slice(I.charCodeAt(b + 6) === Lt ? b + 7 : b + 6, D) || void 0;
      return;
    }
    if (
      ee === 105 &&
      I.charCodeAt(b + 1) === 100 &&
      I.charCodeAt(b + 2) === 58
    ) {
      let Vt = I.slice(I.charCodeAt(b + 3) === Lt ? b + 4 : b + 3, D);
      u = Vt.includes("\0") ? void 0 : Vt;
      return;
    }
    if (ee === 58) {
      if (r) {
        let Vt = I.slice(b, D);
        r(Vt.slice(I.charCodeAt(b + 1) === Lt ? 2 : 1));
      }
      return;
    }
    let re = I.slice(b, D),
      Pe = re.indexOf(":");
    if (Pe === -1) {
      j(re, "", re);
      return;
    }
    let si = re.slice(0, Pe),
      xa = re.charCodeAt(Pe + 1) === Lt ? 2 : 1,
      ka = re.slice(Pe + xa);
    j(si, ka, re);
  }
  function j(I, b, D) {
    switch (I) {
      case "event":
        f = b || void 0;
        break;
      case "data":
        ((l =
          d === 0
            ? b
            : `${l}
${b}`),
          d++);
        break;
      case "id":
        u = b.includes("\0") ? void 0 : b;
        break;
      case "retry":
        /^\d+$/.test(b)
          ? o(parseInt(b, 10))
          : n(
              new oi(`Invalid \`retry\` value: "${b}"`, {
                type: "invalid-retry",
                value: b,
                line: D,
              }),
            );
        break;
      default:
        n(
          new oi(
            `Unknown field "${I.length > 20 ? `${I.slice(0, 20)}\u2026` : I}"`,
            { type: "unknown-field", field: I, value: b, line: D },
          ),
        );
        break;
    }
  }
  function Z() {
    (d > 0 && t({ id: u, event: f, data: l }),
      (u = void 0),
      (l = ""),
      (d = 0),
      (f = void 0));
  }
  function B(I = {}) {
    if (I.consume && a.length > 0) {
      let b = a.join("");
      T(b, 0, b.length);
    }
    ((c = !0),
      (u = void 0),
      (l = ""),
      (d = 0),
      (f = void 0),
      (a.length = 0),
      (s = 0),
      (m = !1));
  }
  return { feed: v, reset: B };
}
function zh(e, t, n) {
  return (
    n === 100 &&
    e.charCodeAt(t + 1) === 97 &&
    e.charCodeAt(t + 2) === 116 &&
    e.charCodeAt(t + 3) === 97 &&
    e.charCodeAt(t + 4) === 58
  );
}
function Ph(e, t, n) {
  return (
    n === 101 &&
    e.charCodeAt(t + 1) === 118 &&
    e.charCodeAt(t + 2) === 101 &&
    e.charCodeAt(t + 3) === 110 &&
    e.charCodeAt(t + 4) === 116 &&
    e.charCodeAt(t + 5) === 58
  );
}
var $a = class extends TransformStream {
  constructor({ onError: t, onRetry: n, onComment: o, maxBufferSize: r } = {}) {
    let i;
    super({
      start(a) {
        i = Oh({
          onEvent: (s) => {
            a.enqueue(s);
          },
          onError(s) {
            (typeof t == "function" && t(s),
              (t === "terminate" || s.type === "max-buffer-size-exceeded") &&
                a.error(s));
          },
          onRetry: n,
          onComment: o,
          maxBufferSize: r,
        });
      },
      transform(a) {
        i.feed(a);
      },
    });
  }
};
var Uk = Symbol.for("workflow-serialize"),
  Ek = Symbol.for("workflow-deserialize");
function IP(e) {
  return e === void 0 ? [] : Array.isArray(e) ? e : [e];
}
function SP(...e) {
  return e.reduce((t, n) => ({ ...t, ...(n ?? {}) }), {});
}
var { btoa: Zk, atob: Ck } = globalThis;
function lf(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/"),
    n = Ck(t);
  return Uint8Array.from(n, (o) => o.codePointAt(0));
}
function Lk(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) t += String.fromCodePoint(e[n]);
  return Zk(t);
}
function zP(e) {
  return e instanceof Uint8Array ? Lk(e) : e;
}
function PP(e) {
  return e.type === "text"
    ? new TextEncoder().encode(e.text)
    : e.data instanceof Uint8Array
      ? e.data
      : e.data instanceof ArrayBuffer
        ? new Uint8Array(e.data)
        : lf(e.data);
}
function OP({ tools: e = [], providerToolNames: t }) {
  let n = {},
    o = {};
  for (let r of e)
    if (r.type === "provider" && r.id in t) {
      let i = t[r.id];
      ((n[r.name] = i), (o[i] = r.name));
    }
  return {
    toProviderToolName: (r) => {
      var i;
      return (i = n[r]) != null ? i : r;
    },
    toCustomToolName: (r) => {
      var i;
      return (i = o[r]) != null ? i : r;
    },
  };
}
async function Rk(e, t) {
  if (e == null) return Promise.resolve();
  let n = t?.abortSignal;
  return new Promise((o, r) => {
    if (n?.aborted) {
      r(jh());
      return;
    }
    let i = setTimeout(() => {
        (a(), o());
      }, e),
      a = () => {
        (clearTimeout(i), n?.removeEventListener("abort", s));
      },
      s = () => {
        (a(), r(jh()));
      };
    n?.addEventListener("abort", s);
  });
}
function jh() {
  return new DOMException("Delay was aborted", "AbortError");
}
var jP = class {
    constructor() {
      ((this.status = { type: "pending" }),
        (this._resolve = void 0),
        (this._reject = void 0));
    }
    get promise() {
      return this._promise
        ? this._promise
        : ((this._promise = new Promise((e, t) => {
            (this.status.type === "resolved"
              ? e(this.status.value)
              : this.status.type === "rejected" && t(this.status.error),
              (this._resolve = e),
              (this._reject = t));
          })),
          this._promise);
    }
    resolve(e) {
      var t;
      ((this.status = { type: "resolved", value: e }),
        this._promise && ((t = this._resolve) == null || t.call(this, e)));
    }
    reject(e) {
      var t;
      ((this.status = { type: "rejected", error: e }),
        this._promise && ((t = this._reject) == null || t.call(this, e)));
    }
    isResolved() {
      return this.status.type === "resolved";
    }
    isRejected() {
      return this.status.type === "rejected";
    }
    isPending() {
      return this.status.type === "pending";
    }
  },
  Zh = [
    { mediaType: "image/gif", bytesPrefix: [71, 73, 70] },
    { mediaType: "image/png", bytesPrefix: [137, 80, 78, 71] },
    { mediaType: "image/jpeg", bytesPrefix: [255, 216] },
    {
      mediaType: "image/webp",
      bytesPrefix: [82, 73, 70, 70, null, null, null, null, 87, 69, 66, 80],
    },
    { mediaType: "image/bmp", bytesPrefix: [66, 77] },
    { mediaType: "image/tiff", bytesPrefix: [73, 73, 42, 0] },
    { mediaType: "image/tiff", bytesPrefix: [77, 77, 0, 42] },
    {
      mediaType: "image/avif",
      bytesPrefix: [0, 0, 0, 32, 102, 116, 121, 112, 97, 118, 105, 102],
    },
    {
      mediaType: "image/heic",
      bytesPrefix: [0, 0, 0, 32, 102, 116, 121, 112, 104, 101, 105, 99],
    },
  ],
  Ch = [{ mediaType: "application/pdf", bytesPrefix: [37, 80, 68, 70] }],
  Lh = [
    { mediaType: "audio/mpeg", bytesPrefix: [255, 251] },
    { mediaType: "audio/mpeg", bytesPrefix: [255, 250] },
    { mediaType: "audio/mpeg", bytesPrefix: [255, 243] },
    { mediaType: "audio/mpeg", bytesPrefix: [255, 242] },
    { mediaType: "audio/mpeg", bytesPrefix: [255, 227] },
    { mediaType: "audio/mpeg", bytesPrefix: [255, 226] },
    {
      mediaType: "audio/wav",
      bytesPrefix: [82, 73, 70, 70, null, null, null, null, 87, 65, 86, 69],
    },
    { mediaType: "audio/ogg", bytesPrefix: [79, 103, 103, 83] },
    { mediaType: "audio/flac", bytesPrefix: [102, 76, 97, 67] },
    { mediaType: "audio/aac", bytesPrefix: [64, 21, 0, 0] },
    { mediaType: "audio/mp4", bytesPrefix: [102, 116, 121, 112] },
    { mediaType: "audio/webm", bytesPrefix: [26, 69, 223, 163] },
  ],
  Rh = [
    {
      mediaType: "video/mp4",
      bytesPrefix: [0, 0, 0, null, 102, 116, 121, 112],
    },
    { mediaType: "video/webm", bytesPrefix: [26, 69, 223, 163] },
    {
      mediaType: "video/quicktime",
      bytesPrefix: [0, 0, 0, 20, 102, 116, 121, 112, 113, 116],
    },
    { mediaType: "video/x-msvideo", bytesPrefix: [82, 73, 70, 70] },
  ],
  Vk = (e) => {
    let t = typeof e == "string" ? lf(e) : e,
      n =
        ((t[6] & 127) << 21) |
        ((t[7] & 127) << 14) |
        ((t[8] & 127) << 7) |
        (t[9] & 127);
    return t.slice(n + 10);
  };
function Fk(e) {
  return (typeof e == "string" && e.startsWith("SUQz")) ||
    (typeof e != "string" &&
      e.length > 10 &&
      e[0] === 73 &&
      e[1] === 68 &&
      e[2] === 51)
    ? Vk(e)
    : e;
}
function Nh({ data: e, signatures: t }) {
  let n = Fk(e),
    o = typeof n == "string" ? lf(n.substring(0, Math.min(n.length, 24))) : n;
  for (let r of t)
    if (
      o.length >= r.bytesPrefix.length &&
      r.bytesPrefix.every((i, a) => i === null || o[a] === i)
    )
      return r.mediaType;
}
var Mk = { image: Zh, audio: Lh, video: Rh, application: Ch };
function Jk({ data: e, topLevelType: t }) {
  if (t === void 0)
    return Nh({ data: e, signatures: [...Zh, ...Ch, ...Lh, ...Rh] });
  let n = Mk[t];
  if (n !== void 0) return Nh({ data: e, signatures: n });
}
function Bk(e) {
  let t = e.indexOf("/");
  return t === -1 ? e : e.substring(0, t);
}
function Kk(e) {
  let t = e.indexOf("/");
  if (t === -1) return !1;
  let n = e.substring(t + 1);
  return n.length > 0 && n !== "*";
}
async function Vh(e) {
  var t;
  try {
    await ((t = e.body) == null ? void 0 : t.cancel());
  } catch {}
}
var Fh = "AI_DownloadError",
  Mh = `vercel.ai.error.${Fh}`,
  Wk = Symbol.for(Mh),
  Th,
  Ah,
  Be = class extends ((Ah = K), (Th = Wk), Ah) {
    constructor({
      url: e,
      statusCode: t,
      statusText: n,
      cause: o,
      message: r = o == null
        ? `Failed to download ${e}: ${t} ${n}`
        : `Failed to download ${e}: ${o}`,
    }) {
      (super({ name: Fh, message: r, cause: o }),
        (this[Th] = !0),
        (this.url = e),
        (this.statusCode = t),
        (this.statusText = n));
    }
    static isInstance(e) {
      return K.hasMarker(e, Mh);
    }
  };
function Gk(e = globalThis) {
  return e.window != null;
}
function qk(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    throw new Be({ url: e, message: `Invalid URL: ${e}` });
  }
  if (t.protocol === "data:") return;
  if (t.protocol !== "http:" && t.protocol !== "https:")
    throw new Be({
      url: e,
      message: `URL scheme must be http, https, or data, got ${t.protocol}`,
    });
  let n = t.hostname.toLowerCase().replace(/\.+$/, "");
  if (!n) throw new Be({ url: e, message: "URL must have a hostname" });
  if (n === "localhost" || n.endsWith(".local") || n.endsWith(".localhost"))
    throw new Be({ url: e, message: `URL with hostname ${n} is not allowed` });
  if (n.startsWith("[") && n.endsWith("]")) {
    let o = n.slice(1, -1);
    if (Hk(o))
      throw new Be({
        url: e,
        message: `URL with IPv6 address ${n} is not allowed`,
      });
    return;
  }
  if (Jh(n)) {
    if (Bh(n))
      throw new Be({
        url: e,
        message: `URL with IP address ${n} is not allowed`,
      });
    return;
  }
}
function Jh(e) {
  let t = e.split(".");
  return t.length !== 4
    ? !1
    : t.every((n) => {
        let o = Number(n);
        return Number.isInteger(o) && o >= 0 && o <= 255 && String(o) === n;
      });
}
function Bh(e) {
  let t = e.split(".").map(Number),
    [n, o, r] = t;
  return (
    n === 0 ||
    n === 10 ||
    (n === 100 && o >= 64 && o <= 127) ||
    n === 127 ||
    (n === 169 && o === 254) ||
    (n === 172 && o >= 16 && o <= 31) ||
    (n === 192 && o === 0 && r === 0) ||
    (n === 192 && o === 168) ||
    (n === 198 && (o === 18 || o === 19)) ||
    n >= 240
  );
}
function Xk(e) {
  let t = e.toLowerCase(),
    n = t.indexOf("%");
  n !== -1 && (t = t.slice(0, n));
  let o = t.split("::");
  if (o.length > 2) return null;
  let r = (a) => {
      if (a === "") return [];
      let s = [],
        c = a.split(":");
      for (let u = 0; u < c.length; u++) {
        let l = c[u];
        if (l.includes(".")) {
          if (u !== c.length - 1 || !Jh(l)) return null;
          let [d, f, m, v] = l.split(".").map(Number);
          s.push((d << 8) | f, (m << 8) | v);
          continue;
        }
        if (!/^[0-9a-f]{1,4}$/.test(l)) return null;
        s.push(parseInt(l, 16));
      }
      return s;
    },
    i = r(o[0]);
  if (i === null) return null;
  if (o.length === 2) {
    let a = r(o[1]);
    if (a === null) return null;
    let s = 8 - i.length - a.length;
    return s < 0 ? null : [...i, ...new Array(s).fill(0), ...a];
  }
  return i.length === 8 ? i : null;
}
function Hk(e) {
  let t = Xk(e);
  if (t === null) return !0;
  let n = (r) => t.slice(0, r).every((i) => i === 0);
  if (
    (n(7) && (t[7] === 0 || t[7] === 1)) ||
    (t[0] & 65024) === 64512 ||
    (t[0] & 65472) === 65152 ||
    (t[0] & 65472) === 65216 ||
    (t[0] & 65280) === 65280
  )
    return !0;
  if (
    n(6) ||
    (n(5) && t[5] === 65535) ||
    (n(4) && t[4] === 65535 && t[5] === 0) ||
    (t[0] === 100 &&
      t[1] === 65435 &&
      t[2] === 0 &&
      t[3] === 0 &&
      t[4] === 0 &&
      t[5] === 0) ||
    (t[0] === 100 && t[1] === 65435 && t[2] === 1)
  ) {
    let r = (t[6] >> 8) & 255,
      i = t[6] & 255,
      a = (t[7] >> 8) & 255,
      s = t[7] & 255;
    return Bh(`${r}.${i}.${a}.${s}`);
  }
  return !1;
}
var Yk = 10;
async function TP({
  url: e,
  headers: t,
  abortSignal: n,
  maxRedirects: o = Yk,
}) {
  let r = { signal: n };
  t !== void 0 && (r.headers = t);
  let i = e;
  for (let a = 0; a <= o; a++) {
    qk(i);
    let s = await fetch(i, { ...r, redirect: "manual" });
    if (s.type === "opaqueredirect") {
      if (!Gk())
        throw new Be({
          url: e,
          message: `Redirect from ${i} could not be validated and was blocked`,
        });
      return await fetch(i, { ...r, redirect: "follow" });
    }
    let c = s.headers.get("location");
    if (s.status >= 300 && s.status < 400 && c) {
      (await Vh(s), (i = new URL(c, i).toString()));
      continue;
    }
    return s;
  }
  throw new Be({ url: e, message: `Too many redirects (max ${o})` });
}
var Qk = 2 * 1024 * 1024 * 1024;
async function ew({ response: e, url: t, maxBytes: n = Qk }) {
  let o = e.headers.get("content-length");
  if (o != null) {
    let l = parseInt(o, 10);
    if (!isNaN(l) && l > n)
      throw (
        await Vh(e),
        new Be({
          url: t,
          message: `Download of ${t} exceeded maximum size of ${n} bytes (Content-Length: ${l}).`,
        })
      );
  }
  let r = e.body;
  if (r == null) return new Uint8Array(0);
  let i = r.getReader(),
    a = [],
    s = 0;
  try {
    for (;;) {
      let { done: l, value: d } = await i.read();
      if (l) break;
      if (((s += d.length), s > n))
        throw new Be({
          url: t,
          message: `Download of ${t} exceeded maximum size of ${n} bytes.`,
        });
      a.push(d);
    }
  } finally {
    try {
      await i.cancel();
    } finally {
      i.releaseLock();
    }
  }
  let c = new Uint8Array(s),
    u = 0;
  for (let l of a) (c.set(l, u), (u += l.length));
  return c;
}
function ai(e) {
  return Object.fromEntries([...e.headers]);
}
function AP(...e) {
  return e.filter((t) => t != null);
}
var tw = ({
    prefix: e,
    size: t = 16,
    alphabet:
      n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    separator: o = "-",
  } = {}) => {
    let r = () => {
      let i = n.length,
        a = new Array(t);
      for (let s = 0; s < t; s++) a[s] = n[(Math.random() * i) | 0];
      return a.join("");
    };
    if (e == null) return r;
    if (n.includes(o))
      throw new li({
        argument: "separator",
        message: `The separator "${o}" must not be part of the alphabet "${n}".`,
      });
    return () => `${e}${o}${r()}`;
  },
  UP = tw();
function Mr(e) {
  return (
    (e instanceof Error || e instanceof DOMException) &&
    (e.name === "AbortError" ||
      e.name === "ResponseAborted" ||
      e.name === "TimeoutError")
  );
}
var rw = ["fetch failed", "failed to fetch"],
  nw = [
    "ConnectionRefused",
    "ConnectionClosed",
    "FailedToOpenSocket",
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "EPIPE",
  ];
function iw(e) {
  if (!(e instanceof Error)) return !1;
  let t = e.code;
  return !!(typeof t == "string" && nw.includes(t));
}
function Kh({ error: e, url: t, requestBodyValues: n }) {
  if (Mr(e)) return e;
  if (e instanceof TypeError && rw.includes(e.message.toLowerCase())) {
    let o = e.cause;
    if (o != null)
      return new oe({
        message: `Cannot connect to API: ${o.message}`,
        cause: o,
        url: t,
        requestBodyValues: n,
        isRetryable: !0,
      });
  }
  return iw(e)
    ? new oe({
        message: `Cannot connect to API: ${e.message}`,
        cause: e,
        url: t,
        requestBodyValues: n,
        isRetryable: !0,
      })
    : e;
}
function Wh(e = globalThis) {
  var t, n, o;
  return e.window
    ? "runtime/browser"
    : (t = e.navigator) != null && t.userAgent
      ? `runtime/${e.navigator.userAgent.toLowerCase()}`
      : (o = (n = e.process) == null ? void 0 : n.versions) != null && o.node
        ? `runtime/node.js/${e.process.version.substring(0)}`
        : e.EdgeRuntime
          ? "runtime/vercel-edge"
          : "runtime/unknown";
}
function ow(e) {
  if (e == null) return {};
  let t = {};
  if (e instanceof Headers)
    e.forEach((n, o) => {
      t[o.toLowerCase()] = n;
    });
  else {
    Array.isArray(e) || (e = Object.entries(e));
    for (let [n, o] of e) o != null && (t[n.toLowerCase()] = o);
  }
  return t;
}
function Gh(e, ...t) {
  let n = new Headers(ow(e)),
    o = n.get("user-agent") || "";
  return (
    n.set("user-agent", [o, ...t].filter(Boolean).join(" ")),
    Object.fromEntries(n.entries())
  );
}
var qh = "5.0.5",
  aw = () => globalThis.fetch,
  LP = async ({
    url: e,
    headers: t = {},
    successfulResponseHandler: n,
    failedResponseHandler: o,
    abortSignal: r,
    fetch: i = aw(),
  }) => {
    try {
      let a = await i(e, {
          method: "GET",
          headers: Gh(t, `ai-sdk/provider-utils/${qh}`, Wh()),
          signal: r,
        }),
        s = ai(a);
      if (!a.ok) {
        let c;
        try {
          c = await o({ response: a, url: e, requestBodyValues: {} });
        } catch (u) {
          throw Mr(u) || oe.isInstance(u)
            ? u
            : new oe({
                message: "Failed to process error response",
                cause: u,
                statusCode: a.status,
                url: e,
                responseHeaders: s,
                requestBodyValues: {},
              });
        }
        throw c.value;
      }
      try {
        return await n({ response: a, url: e, requestBodyValues: {} });
      } catch (c) {
        throw c instanceof Error && (Mr(c) || oe.isInstance(c))
          ? c
          : new oe({
              message: "Failed to process successful response",
              cause: c,
              statusCode: a.status,
              url: e,
              responseHeaders: s,
              requestBodyValues: {},
            });
      }
    } catch (a) {
      throw Kh({ error: a, url: e, requestBodyValues: {} });
    }
  };
function sw(e) {
  var t, n;
  return (n = (t = globalThis.Buffer) == null ? void 0 : t.isBuffer(e)) != null
    ? n
    : !1;
}
function RP(e) {
  return e != null;
}
function VP(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    !(e instanceof Uint8Array) &&
    !(e instanceof URL) &&
    !(e instanceof ArrayBuffer) &&
    !sw(e) &&
    !("type" in e)
  );
}
function FP({ mediaType: e, url: t, supportedUrls: n }) {
  ((t = t.toLowerCase()), (e = e.toLowerCase()));
  let o = !e.includes("/");
  return Object.entries(n)
    .map(([r, i]) => {
      let a = r.toLowerCase();
      return a === "*" || a === "*/*"
        ? { mediaTypePrefix: "", regexes: i }
        : { mediaTypePrefix: a.replace(/\*/, ""), regexes: i };
    })
    .filter(({ mediaTypePrefix: r }) =>
      r === "" ? !0 : o ? `${e}/` === r : e.startsWith(r),
    )
    .flatMap(({ regexes: r }) => r)
    .some((r) => r.test(t));
}
function JP({
  apiKey: e,
  environmentVariableName: t,
  apiKeyParameterName: n = "apiKey",
  description: o,
}) {
  if (typeof e == "string") return e;
  if (e != null) throw new Br({ message: `${o} API key must be a string.` });
  if (typeof process > "u")
    throw new Br({
      message: `${o} API key is missing. Pass it using the '${n}' parameter. Environment variables are not supported in this environment.`,
    });
  if (((e = process.env[t]), e == null))
    throw new Br({
      message: `${o} API key is missing. Pass it using the '${n}' parameter or the ${t} environment variable.`,
    });
  if (typeof e != "string")
    throw new Br({
      message: `${o} API key must be a string. The value of the ${t} environment variable is not a string.`,
    });
  return e;
}
function BP({ settingValue: e, environmentVariableName: t }) {
  if (typeof e == "string") return e;
  if (
    !(e != null || typeof process > "u") &&
    ((e = process.env[t]), !(e == null || typeof e != "string"))
  )
    return e;
}
function KP(e) {
  return e !== void 0 && e !== "provider-default";
}
function WP({ reasoning: e, effortMap: t, warnings: n }) {
  let o = t[e];
  if (o == null) {
    n.push({
      type: "unsupported",
      feature: "reasoning",
      details: `reasoning "${e}" is not supported by this model.`,
    });
    return;
  }
  return (
    o !== e &&
      n.push({
        type: "compatibility",
        feature: "reasoning",
        details: `reasoning "${e}" is not directly supported by this model. mapped to effort "${o}".`,
      }),
    o
  );
}
var uw = { minimal: 0.02, low: 0.1, medium: 0.3, high: 0.6, xhigh: 0.9 };
function GP({
  reasoning: e,
  maxOutputTokens: t,
  maxReasoningBudget: n,
  minReasoningBudget: o = 1024,
  budgetPercentages: r = uw,
  warnings: i,
}) {
  let a = r[e];
  if (a == null) {
    i.push({
      type: "unsupported",
      feature: "reasoning",
      details: `reasoning "${e}" is not supported by this model.`,
    });
    return;
  }
  return Math.min(n, Math.max(o, Math.round(t * a)));
}
var cw =
    /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/,
  lw =
    /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
function Dh(e) {
  let t = JSON.parse(e);
  return t === null ||
    typeof t != "object" ||
    (cw.test(e) === !1 && lw.test(e) === !1)
    ? t
    : dw(t);
}
function dw(e) {
  let t = [e];
  for (; t.length;) {
    let n = t;
    t = [];
    for (let o of n) {
      if (Object.prototype.hasOwnProperty.call(o, "__proto__"))
        throw new SyntaxError("Object contains forbidden prototype property");
      if (
        Object.prototype.hasOwnProperty.call(o, "constructor") &&
        o.constructor !== null &&
        typeof o.constructor == "object" &&
        Object.prototype.hasOwnProperty.call(o.constructor, "prototype")
      )
        throw new SyntaxError("Object contains forbidden prototype property");
      for (let r in o) {
        let i = o[r];
        i && typeof i == "object" && t.push(i);
      }
    }
  }
  return e;
}
function Xh(e) {
  let { stackTraceLimit: t } = Error;
  try {
    Error.stackTraceLimit = 0;
  } catch {
    return Dh(e);
  }
  try {
    return Dh(e);
  } finally {
    Error.stackTraceLimit = t;
  }
}
function df(e) {
  if (
    e.type === "object" ||
    (Array.isArray(e.type) && e.type.includes("object"))
  ) {
    e.additionalProperties = !1;
    let { properties: n } = e;
    if (n != null) for (let o of Object.keys(n)) n[o] = Rt(n[o]);
  }
  (e.items != null &&
    (e.items = Array.isArray(e.items) ? e.items.map(Rt) : Rt(e.items)),
    e.anyOf != null && (e.anyOf = e.anyOf.map(Rt)),
    e.allOf != null && (e.allOf = e.allOf.map(Rt)),
    e.oneOf != null && (e.oneOf = e.oneOf.map(Rt)));
  let { definitions: t } = e;
  if (t != null) for (let n of Object.keys(t)) t[n] = Rt(t[n]);
  return e;
}
function Rt(e) {
  return typeof e == "boolean" ? e : df(e);
}
var fw = Symbol("Let zodToJsonSchema decide on which parser to use"),
  Uh = {
    name: void 0,
    $refStrategy: "root",
    basePath: ["#"],
    effectStrategy: "input",
    pipeStrategy: "all",
    dateStrategy: "format:date-time",
    mapStrategy: "entries",
    removeAdditionalStrategy: "passthrough",
    allowedAdditionalProperties: !0,
    rejectedAdditionalProperties: !1,
    definitionPath: "definitions",
    strictUnions: !1,
    definitions: {},
    errorMessages: !1,
    patternStrategy: "escape",
    applyRegexFlags: !1,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref",
  },
  mw = (e) => (typeof e == "string" ? { ...Uh, name: e } : { ...Uh, ...e });
function ze() {
  return {};
}
function pw(e, t) {
  var n, o, r;
  let i = { type: "array" };
  return (
    (n = e.type) != null &&
      n._def &&
      ((r = (o = e.type) == null ? void 0 : o._def) == null
        ? void 0
        : r.typeName) !== w.ZodAny &&
      (i.items = H(e.type._def, {
        ...t,
        currentPath: [...t.currentPath, "items"],
      })),
    e.minLength && (i.minItems = e.minLength.value),
    e.maxLength && (i.maxItems = e.maxLength.value),
    e.exactLength &&
      ((i.minItems = e.exactLength.value), (i.maxItems = e.exactLength.value)),
    i
  );
}
function gw(e) {
  let t = { type: "integer", format: "int64" };
  if (!e.checks) return t;
  for (let n of e.checks)
    switch (n.kind) {
      case "min":
        n.inclusive ? (t.minimum = n.value) : (t.exclusiveMinimum = n.value);
        break;
      case "max":
        n.inclusive ? (t.maximum = n.value) : (t.exclusiveMaximum = n.value);
        break;
      case "multipleOf":
        t.multipleOf = n.value;
        break;
    }
  return t;
}
function vw() {
  return { type: "boolean" };
}
function Hh(e, t) {
  return H(e.type._def, t);
}
var hw = (e, t) => H(e.innerType._def, t);
function Yh(e, t, n) {
  let o = n ?? t.dateStrategy;
  if (Array.isArray(o)) return { anyOf: o.map((r) => Yh(e, t, r)) };
  switch (o) {
    case "string":
    case "format:date-time":
      return { type: "string", format: "date-time" };
    case "format:date":
      return { type: "string", format: "date" };
    case "integer":
      return yw(e);
  }
}
var yw = (e) => {
  let t = { type: "integer", format: "unix-time" };
  for (let n of e.checks)
    switch (n.kind) {
      case "min":
        t.minimum = n.value;
        break;
      case "max":
        t.maximum = n.value;
        break;
    }
  return t;
};
function $w(e, t) {
  return { ...H(e.innerType._def, t), default: e.defaultValue() };
}
function _w(e, t) {
  return t.effectStrategy === "input" ? H(e.schema._def, t) : ze();
}
function bw(e) {
  return { type: "string", enum: Array.from(e.values) };
}
var xw = (e) => ("type" in e && e.type === "string" ? !1 : "allOf" in e);
function kw(e, t) {
  let n = [
      H(e.left._def, { ...t, currentPath: [...t.currentPath, "allOf", "0"] }),
      H(e.right._def, { ...t, currentPath: [...t.currentPath, "allOf", "1"] }),
    ].filter((r) => !!r),
    o = [];
  return (
    n.forEach((r) => {
      if (xw(r)) o.push(...r.allOf);
      else {
        let i = r;
        if ("additionalProperties" in r && r.additionalProperties === !1) {
          let { additionalProperties: a, ...s } = r;
          i = s;
        }
        o.push(i);
      }
    }),
    o.length ? { allOf: o } : void 0
  );
}
function ww(e) {
  let t = typeof e.value;
  return t !== "bigint" && t !== "number" && t !== "boolean" && t !== "string"
    ? { type: Array.isArray(e.value) ? "array" : "object" }
    : { type: t === "bigint" ? "integer" : t, const: e.value };
}
var af = void 0,
  Ce = {
    cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    email:
      /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    emoji: () => (
      af === void 0 &&
        (af = RegExp(
          "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
          "u",
        )),
      af
    ),
    uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv4Cidr:
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    ipv6Cidr:
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    base64url:
      /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
    nanoid: /^[a-zA-Z0-9_-]{21}$/,
    jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  };
function Qh(e, t) {
  let n = { type: "string" };
  if (e.checks)
    for (let o of e.checks)
      switch (o.kind) {
        case "min":
          n.minLength =
            typeof n.minLength == "number"
              ? Math.max(n.minLength, o.value)
              : o.value;
          break;
        case "max":
          n.maxLength =
            typeof n.maxLength == "number"
              ? Math.min(n.maxLength, o.value)
              : o.value;
          break;
        case "email":
          switch (t.emailStrategy) {
            case "format:email":
              Le(n, "email", o.message, t);
              break;
            case "format:idn-email":
              Le(n, "idn-email", o.message, t);
              break;
            case "pattern:zod":
              he(n, Ce.email, o.message, t);
              break;
          }
          break;
        case "url":
          Le(n, "uri", o.message, t);
          break;
        case "uuid":
          Le(n, "uuid", o.message, t);
          break;
        case "regex":
          he(n, o.regex, o.message, t);
          break;
        case "cuid":
          he(n, Ce.cuid, o.message, t);
          break;
        case "cuid2":
          he(n, Ce.cuid2, o.message, t);
          break;
        case "startsWith":
          he(n, RegExp(`^${sf(o.value, t)}`), o.message, t);
          break;
        case "endsWith":
          he(n, RegExp(`${sf(o.value, t)}$`), o.message, t);
          break;
        case "datetime":
          Le(n, "date-time", o.message, t);
          break;
        case "date":
          Le(n, "date", o.message, t);
          break;
        case "time":
          Le(n, "time", o.message, t);
          break;
        case "duration":
          Le(n, "duration", o.message, t);
          break;
        case "length":
          ((n.minLength =
            typeof n.minLength == "number"
              ? Math.max(n.minLength, o.value)
              : o.value),
            (n.maxLength =
              typeof n.maxLength == "number"
                ? Math.min(n.maxLength, o.value)
                : o.value));
          break;
        case "includes": {
          he(n, RegExp(sf(o.value, t)), o.message, t);
          break;
        }
        case "ip": {
          (o.version !== "v6" && Le(n, "ipv4", o.message, t),
            o.version !== "v4" && Le(n, "ipv6", o.message, t));
          break;
        }
        case "base64url":
          he(n, Ce.base64url, o.message, t);
          break;
        case "jwt":
          he(n, Ce.jwt, o.message, t);
          break;
        case "cidr": {
          (o.version !== "v6" && he(n, Ce.ipv4Cidr, o.message, t),
            o.version !== "v4" && he(n, Ce.ipv6Cidr, o.message, t));
          break;
        }
        case "emoji":
          he(n, Ce.emoji(), o.message, t);
          break;
        case "ulid": {
          he(n, Ce.ulid, o.message, t);
          break;
        }
        case "base64": {
          switch (t.base64Strategy) {
            case "format:binary": {
              Le(n, "binary", o.message, t);
              break;
            }
            case "contentEncoding:base64": {
              n.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              he(n, Ce.base64, o.message, t);
              break;
            }
          }
          break;
        }
        case "nanoid":
          he(n, Ce.nanoid, o.message, t);
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
      }
  return n;
}
function sf(e, t) {
  return t.patternStrategy === "escape" ? Sw(e) : e;
}
var Iw = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789",
);
function Sw(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) (Iw.has(e[n]) || (t += "\\"), (t += e[n]));
  return t;
}
function Le(e, t, n, o) {
  var r;
  e.format || ((r = e.anyOf) != null && r.some((i) => i.format))
    ? (e.anyOf || (e.anyOf = []),
      e.format && (e.anyOf.push({ format: e.format }), delete e.format),
      e.anyOf.push({
        format: t,
        ...(n && o.errorMessages && { errorMessage: { format: n } }),
      }))
    : (e.format = t);
}
function he(e, t, n, o) {
  var r;
  e.pattern || ((r = e.allOf) != null && r.some((i) => i.pattern))
    ? (e.allOf || (e.allOf = []),
      e.pattern && (e.allOf.push({ pattern: e.pattern }), delete e.pattern),
      e.allOf.push({
        pattern: Eh(t, o),
        ...(n && o.errorMessages && { errorMessage: { pattern: n } }),
      }))
    : (e.pattern = Eh(t, o));
}
function Eh(e, t) {
  var n;
  if (!t.applyRegexFlags || !e.flags) return e.source;
  let o = {
      i: e.flags.includes("i"),
      m: e.flags.includes("m"),
      s: e.flags.includes("s"),
    },
    r = o.i ? e.source.toLowerCase() : e.source,
    i = "",
    a = !1,
    s = !1,
    c = !1;
  for (let u = 0; u < r.length; u++) {
    if (a) {
      ((i += r[u]), (a = !1));
      continue;
    }
    if (o.i) {
      if (s) {
        if (r[u].match(/[a-z]/)) {
          c
            ? ((i += r[u]),
              (i += `${r[u - 2]}-${r[u]}`.toUpperCase()),
              (c = !1))
            : r[u + 1] === "-" && (n = r[u + 2]) != null && n.match(/[a-z]/)
              ? ((i += r[u]), (c = !0))
              : (i += `${r[u]}${r[u].toUpperCase()}`);
          continue;
        }
      } else if (r[u].match(/[a-z]/)) {
        i += `[${r[u]}${r[u].toUpperCase()}]`;
        continue;
      }
    }
    if (o.m) {
      if (r[u] === "^") {
        i += `(^|(?<=[\r
]))`;
        continue;
      } else if (r[u] === "$") {
        i += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (o.s && r[u] === ".") {
      i += s
        ? `${r[u]}\r
`
        : `[${r[u]}\r
]`;
      continue;
    }
    ((i += r[u]),
      r[u] === "\\"
        ? (a = !0)
        : s && r[u] === "]"
          ? (s = !1)
          : !s && r[u] === "[" && (s = !0));
  }
  try {
    new RegExp(i);
  } catch {
    return (
      console.warn(
        `Could not convert regex pattern at ${t.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`,
      ),
      e.source
    );
  }
  return i;
}
function ey(e, t) {
  var n, o, r, i, a, s;
  let c = {
    type: "object",
    additionalProperties:
      (n = H(e.valueType._def, {
        ...t,
        currentPath: [...t.currentPath, "additionalProperties"],
      })) != null
        ? n
        : t.allowedAdditionalProperties,
  };
  if (
    ((o = e.keyType) == null ? void 0 : o._def.typeName) === w.ZodString &&
    (r = e.keyType._def.checks) != null &&
    r.length
  ) {
    let { type: u, ...l } = Qh(e.keyType._def, t);
    return { ...c, propertyNames: l };
  } else {
    if (((i = e.keyType) == null ? void 0 : i._def.typeName) === w.ZodEnum)
      return { ...c, propertyNames: { enum: e.keyType._def.values } };
    if (
      ((a = e.keyType) == null ? void 0 : a._def.typeName) === w.ZodBranded &&
      e.keyType._def.type._def.typeName === w.ZodString &&
      (s = e.keyType._def.type._def.checks) != null &&
      s.length
    ) {
      let { type: u, ...l } = Hh(e.keyType._def, t);
      return { ...c, propertyNames: l };
    }
  }
  return c;
}
function zw(e, t) {
  if (t.mapStrategy === "record") return ey(e, t);
  let n =
      H(e.keyType._def, {
        ...t,
        currentPath: [...t.currentPath, "items", "items", "0"],
      }) || ze(),
    o =
      H(e.valueType._def, {
        ...t,
        currentPath: [...t.currentPath, "items", "items", "1"],
      }) || ze();
  return {
    type: "array",
    maxItems: 125,
    items: { type: "array", items: [n, o], minItems: 2, maxItems: 2 },
  };
}
function Pw(e) {
  let t = e.values,
    o = Object.keys(e.values)
      .filter((i) => typeof t[t[i]] != "number")
      .map((i) => t[i]),
    r = Array.from(new Set(o.map((i) => typeof i)));
  return {
    type:
      r.length === 1
        ? r[0] === "string"
          ? "string"
          : "number"
        : ["string", "number"],
    enum: o,
  };
}
function Ow() {
  return { not: ze() };
}
function jw() {
  return { type: "null" };
}
var uf = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null",
};
function Nw(e, t) {
  let n = e.options instanceof Map ? Array.from(e.options.values()) : e.options;
  if (
    n.every(
      (o) => o._def.typeName in uf && (!o._def.checks || !o._def.checks.length),
    )
  ) {
    let o = n.reduce((r, i) => {
      let a = uf[i._def.typeName];
      return a && !r.includes(a) ? [...r, a] : r;
    }, []);
    return { type: o.length > 1 ? o : o[0] };
  } else if (
    n.every((o) => o._def.typeName === "ZodLiteral" && !o.description)
  ) {
    let o = n.reduce((r, i) => {
      let a = typeof i._def.value;
      switch (a) {
        case "string":
        case "number":
        case "boolean":
          return [...r, a];
        case "bigint":
          return [...r, "integer"];
        case "object":
          if (i._def.value === null) return [...r, "null"];
        default:
          return r;
      }
    }, []);
    if (o.length === n.length) {
      let r = o.filter((i, a, s) => s.indexOf(i) === a);
      return {
        type: r.length > 1 ? r : r[0],
        enum: n.reduce(
          (i, a) => (i.includes(a._def.value) ? i : [...i, a._def.value]),
          [],
        ),
      };
    }
  } else if (n.every((o) => o._def.typeName === "ZodEnum"))
    return {
      type: "string",
      enum: n.reduce(
        (o, r) => [...o, ...r._def.values.filter((i) => !o.includes(i))],
        [],
      ),
    };
  return Tw(e, t);
}
var Tw = (e, t) => {
  let n = (
    e.options instanceof Map ? Array.from(e.options.values()) : e.options
  )
    .map((o, r) =>
      H(o._def, { ...t, currentPath: [...t.currentPath, "anyOf", `${r}`] }),
    )
    .filter(
      (o) =>
        !!o &&
        (!t.strictUnions ||
          (typeof o == "object" && Object.keys(o).length > 0)),
    );
  return n.length ? { anyOf: n } : void 0;
};
function Aw(e, t) {
  if (
    ["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
      e.innerType._def.typeName,
    ) &&
    (!e.innerType._def.checks || !e.innerType._def.checks.length)
  )
    return { type: [uf[e.innerType._def.typeName], "null"] };
  let n = H(e.innerType._def, {
    ...t,
    currentPath: [...t.currentPath, "anyOf", "0"],
  });
  return n && { anyOf: [n, { type: "null" }] };
}
function Dw(e) {
  let t = { type: "number" };
  if (!e.checks) return t;
  for (let n of e.checks)
    switch (n.kind) {
      case "int":
        t.type = "integer";
        break;
      case "min":
        n.inclusive ? (t.minimum = n.value) : (t.exclusiveMinimum = n.value);
        break;
      case "max":
        n.inclusive ? (t.maximum = n.value) : (t.exclusiveMaximum = n.value);
        break;
      case "multipleOf":
        t.multipleOf = n.value;
        break;
    }
  return t;
}
function Uw(e, t) {
  let n = { type: "object", properties: {} },
    o = [],
    r = e.shape();
  for (let a in r) {
    let s = r[a];
    if (s === void 0 || s._def === void 0) continue;
    let c = Zw(s),
      u = H(s._def, {
        ...t,
        currentPath: [...t.currentPath, "properties", a],
        propertyPath: [...t.currentPath, "properties", a],
      });
    u !== void 0 && ((n.properties[a] = u), c || o.push(a));
  }
  o.length && (n.required = o);
  let i = Ew(e, t);
  return (i !== void 0 && (n.additionalProperties = i), n);
}
function Ew(e, t) {
  if (e.catchall._def.typeName !== "ZodNever")
    return H(e.catchall._def, {
      ...t,
      currentPath: [...t.currentPath, "additionalProperties"],
    });
  switch (e.unknownKeys) {
    case "passthrough":
      return t.allowedAdditionalProperties;
    case "strict":
      return t.rejectedAdditionalProperties;
    case "strip":
      return t.removeAdditionalStrategy === "strict"
        ? t.allowedAdditionalProperties
        : t.rejectedAdditionalProperties;
  }
}
function Zw(e) {
  try {
    return e.isOptional();
  } catch {
    return !0;
  }
}
var Cw = (e, t) => {
    var n;
    if (
      t.currentPath.toString() ===
      ((n = t.propertyPath) == null ? void 0 : n.toString())
    )
      return H(e.innerType._def, t);
    let o = H(e.innerType._def, {
      ...t,
      currentPath: [...t.currentPath, "anyOf", "1"],
    });
    return o ? { anyOf: [{ not: ze() }, o] } : ze();
  },
  Lw = (e, t) => {
    if (t.pipeStrategy === "input") return H(e.in._def, t);
    if (t.pipeStrategy === "output") return H(e.out._def, t);
    let n = H(e.in._def, {
        ...t,
        currentPath: [...t.currentPath, "allOf", "0"],
      }),
      o = H(e.out._def, {
        ...t,
        currentPath: [...t.currentPath, "allOf", n ? "1" : "0"],
      });
    return { allOf: [n, o].filter((r) => r !== void 0) };
  };
function Rw(e, t) {
  return H(e.type._def, t);
}
function Vw(e, t) {
  let o = {
    type: "array",
    uniqueItems: !0,
    items: H(e.valueType._def, {
      ...t,
      currentPath: [...t.currentPath, "items"],
    }),
  };
  return (
    e.minSize && (o.minItems = e.minSize.value),
    e.maxSize && (o.maxItems = e.maxSize.value),
    o
  );
}
function Fw(e, t) {
  return e.rest
    ? {
        type: "array",
        minItems: e.items.length,
        items: e.items
          .map((n, o) =>
            H(n._def, {
              ...t,
              currentPath: [...t.currentPath, "items", `${o}`],
            }),
          )
          .reduce((n, o) => (o === void 0 ? n : [...n, o]), []),
        additionalItems: H(e.rest._def, {
          ...t,
          currentPath: [...t.currentPath, "additionalItems"],
        }),
      }
    : {
        type: "array",
        minItems: e.items.length,
        maxItems: e.items.length,
        items: e.items
          .map((n, o) =>
            H(n._def, {
              ...t,
              currentPath: [...t.currentPath, "items", `${o}`],
            }),
          )
          .reduce((n, o) => (o === void 0 ? n : [...n, o]), []),
      };
}
function Mw() {
  return { not: ze() };
}
function Jw() {
  return ze();
}
var Bw = (e, t) => H(e.innerType._def, t),
  Kw = (e, t, n) => {
    switch (t) {
      case w.ZodString:
        return Qh(e, n);
      case w.ZodNumber:
        return Dw(e);
      case w.ZodObject:
        return Uw(e, n);
      case w.ZodBigInt:
        return gw(e);
      case w.ZodBoolean:
        return vw();
      case w.ZodDate:
        return Yh(e, n);
      case w.ZodUndefined:
        return Mw();
      case w.ZodNull:
        return jw();
      case w.ZodArray:
        return pw(e, n);
      case w.ZodUnion:
      case w.ZodDiscriminatedUnion:
        return Nw(e, n);
      case w.ZodIntersection:
        return kw(e, n);
      case w.ZodTuple:
        return Fw(e, n);
      case w.ZodRecord:
        return ey(e, n);
      case w.ZodLiteral:
        return ww(e);
      case w.ZodEnum:
        return bw(e);
      case w.ZodNativeEnum:
        return Pw(e);
      case w.ZodNullable:
        return Aw(e, n);
      case w.ZodOptional:
        return Cw(e, n);
      case w.ZodMap:
        return zw(e, n);
      case w.ZodSet:
        return Vw(e, n);
      case w.ZodLazy:
        return () => e.getter()._def;
      case w.ZodPromise:
        return Rw(e, n);
      case w.ZodNaN:
      case w.ZodNever:
        return Ow();
      case w.ZodEffects:
        return _w(e, n);
      case w.ZodAny:
        return ze();
      case w.ZodUnknown:
        return Jw();
      case w.ZodDefault:
        return $w(e, n);
      case w.ZodBranded:
        return Hh(e, n);
      case w.ZodReadonly:
        return Bw(e, n);
      case w.ZodCatch:
        return hw(e, n);
      case w.ZodPipeline:
        return Lw(e, n);
      case w.ZodFunction:
      case w.ZodVoid:
      case w.ZodSymbol:
        return;
      default:
        return ((o) => {})(t);
    }
  },
  Ww = (e, t) => {
    let n = 0;
    for (; n < e.length && n < t.length && e[n] === t[n]; n++);
    return [(e.length - n).toString(), ...t.slice(n)].join("/");
  };
function H(e, t, n = !1) {
  var o;
  let r = t.seen.get(e);
  if (t.override) {
    let c = (o = t.override) == null ? void 0 : o.call(t, e, t, r, n);
    if (c !== fw) return c;
  }
  if (r && !n) {
    let c = Gw(r, t);
    if (c !== void 0) return c;
  }
  let i = { def: e, path: t.currentPath, jsonSchema: void 0 };
  t.seen.set(e, i);
  let a = Kw(e, e.typeName, t),
    s = typeof a == "function" ? H(a(), t) : a;
  if ((s && qw(e, t, s), t.postProcess)) {
    let c = t.postProcess(s, e, t);
    return ((i.jsonSchema = s), c);
  }
  return ((i.jsonSchema = s), s);
}
var Gw = (e, t) => {
    switch (t.$refStrategy) {
      case "root":
        return { $ref: e.path.join("/") };
      case "relative":
        return { $ref: Ww(t.currentPath, e.path) };
      case "none":
      case "seen":
        return e.path.length < t.currentPath.length &&
          e.path.every((n, o) => t.currentPath[o] === n)
          ? (console.warn(
              `Recursive reference detected at ${t.currentPath.join("/")}! Defaulting to any`,
            ),
            ze())
          : t.$refStrategy === "seen"
            ? ze()
            : void 0;
    }
  },
  qw = (e, t, n) => (e.description && (n.description = e.description), n),
  Xw = (e) => {
    let t = mw(e),
      n =
        t.name !== void 0
          ? [...t.basePath, t.definitionPath, t.name]
          : t.basePath;
    return {
      ...t,
      currentPath: n,
      propertyPath: void 0,
      seen: new Map(
        Object.entries(t.definitions).map(([o, r]) => [
          r._def,
          {
            def: r._def,
            path: [...t.basePath, t.definitionPath, o],
            jsonSchema: void 0,
          },
        ]),
      ),
    };
  },
  Hw = (e, t) => {
    var n;
    let o = Xw(t),
      r =
        typeof t == "object" && t.definitions
          ? Object.entries(t.definitions).reduce((u, [l, d]) => {
              var f;
              return {
                ...u,
                [l]:
                  (f = H(
                    d._def,
                    { ...o, currentPath: [...o.basePath, o.definitionPath, l] },
                    !0,
                  )) != null
                    ? f
                    : ze(),
              };
            }, {})
          : void 0,
      i =
        typeof t == "string"
          ? t
          : t?.nameStrategy === "title"
            ? void 0
            : t?.name,
      a =
        (n = H(
          e._def,
          i === void 0
            ? o
            : { ...o, currentPath: [...o.basePath, o.definitionPath, i] },
          !1,
        )) != null
          ? n
          : ze(),
      s =
        typeof t == "object" && t.name !== void 0 && t.nameStrategy === "title"
          ? t.name
          : void 0;
    s !== void 0 && (a.title = s);
    let c =
      i === void 0
        ? r
          ? { ...a, [o.definitionPath]: r }
          : a
        : {
            $ref: [
              ...(o.$refStrategy === "relative" ? [] : o.basePath),
              o.definitionPath,
              i,
            ].join("/"),
            [o.definitionPath]: { ...r, [i]: a },
          };
    return ((c.$schema = "http://json-schema.org/draft-07/schema#"), c);
  },
  cf = Symbol.for("vercel.ai.schema");
function tO(e) {
  let t;
  return () => (t == null && (t = e()), t);
}
function ba(e, { validate: t } = {}) {
  return {
    [cf]: !0,
    _type: void 0,
    get jsonSchema() {
      return (typeof e == "function" && (e = e()), e);
    },
    validate: t,
  };
}
function Yw(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    cf in e &&
    e[cf] === !0 &&
    "jsonSchema" in e &&
    "validate" in e
  );
}
function Qw(e) {
  return e == null
    ? ba({ type: "object", properties: {}, additionalProperties: !1 })
    : Yw(e)
      ? e
      : "~standard" in e
        ? e["~standard"].vendor === "zod"
          ? iI(e)
          : eI(e)
        : e();
}
function eI(e) {
  return ba(() => df(e["~standard"].jsonSchema.input({ target: "draft-07" })), {
    validate: async (t) => {
      let n = await e["~standard"].validate(t);
      return "value" in n
        ? { success: !0, value: n.value }
        : { success: !1, error: new rt({ value: t, cause: n.issues }) };
    },
  });
}
function tI(e, t) {
  var n;
  let o = (n = t?.useReferences) != null ? n : !1;
  return ba(() => Hw(e, { $refStrategy: o ? "root" : "none" }), {
    validate: async (r) => {
      let i = await e.safeParseAsync(r);
      return i.success
        ? { success: !0, value: i.data }
        : { success: !1, error: i.error };
    },
  });
}
function rI(e, t) {
  var n;
  let o = (n = t?.useReferences) != null ? n : !1;
  return ba(
    () =>
      df(
        _r(e, { target: "draft-7", io: "input", reused: o ? "ref" : "inline" }),
      ),
    {
      validate: async (r) => {
        let i = await Tn(e, r);
        return i.success
          ? { success: !0, value: i.data }
          : { success: !1, error: i.error };
      },
    },
  );
}
function nI(e) {
  return "_zod" in e;
}
function iI(e, t) {
  return nI(e) ? rI(e, t) : tI(e, t);
}
async function oI({ value: e, schema: t, context: n }) {
  let o = await ff({ value: e, schema: t, context: n });
  if (!o.success) throw rt.wrap({ value: e, cause: o.error, context: n });
  return o.value;
}
async function ff({ value: e, schema: t, context: n }) {
  let o = Qw(t);
  try {
    if (o.validate == null) return { success: !0, value: e, rawValue: e };
    let r = await o.validate(e);
    return r.success
      ? { success: !0, value: r.value, rawValue: e }
      : {
          success: !1,
          error: rt.wrap({ value: e, cause: r.error, context: n }),
          rawValue: e,
        };
  } catch (r) {
    return {
      success: !1,
      error: rt.wrap({ value: e, cause: r, context: n }),
      rawValue: e,
    };
  }
}
async function aI({ text: e, schema: t }) {
  try {
    let n = Xh(e);
    return t == null ? n : await oI({ value: n, schema: t });
  } catch (n) {
    throw Jr.isInstance(n) || rt.isInstance(n)
      ? n
      : new Jr({ text: e, cause: n });
  }
}
async function ty({ text: e, schema: t }) {
  try {
    let n = Xh(e);
    return t == null
      ? { success: !0, value: n, rawValue: n }
      : await ff({ value: n, schema: t });
  } catch (n) {
    return {
      success: !1,
      error: Jr.isInstance(n) ? n : new Jr({ text: e, cause: n }),
      rawValue: void 0,
    };
  }
}
function sI({ stream: e, schema: t }) {
  return e
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new $a())
    .pipeThrough(
      new TransformStream({
        async transform({ data: n }, o) {
          n !== "[DONE]" && o.enqueue(await ty({ text: n, schema: t }));
        },
      }),
    );
}
async function iO({ provider: e, providerOptions: t, schema: n }) {
  if (t?.[e] == null) return;
  let o = await ff({ value: t[e], schema: n });
  if (!o.success)
    throw new li({
      argument: "providerOptions",
      message: `invalid ${e} provider options`,
      cause: o.error,
    });
  return o.value;
}
var uI = () => globalThis.fetch,
  aO = async ({
    url: e,
    headers: t,
    body: n,
    failedResponseHandler: o,
    successfulResponseHandler: r,
    abortSignal: i,
    fetch: a,
  }) =>
    await ry({
      url: e,
      headers: { "Content-Type": "application/json", ...t },
      body: { content: JSON.stringify(n), values: n },
      failedResponseHandler: o,
      successfulResponseHandler: r,
      abortSignal: i,
      fetch: a,
    }),
  sO = async ({
    url: e,
    headers: t,
    formData: n,
    failedResponseHandler: o,
    successfulResponseHandler: r,
    abortSignal: i,
    fetch: a,
  }) =>
    await ry({
      url: e,
      headers: t,
      body: { content: n, values: Object.fromEntries(n.entries()) },
      failedResponseHandler: o,
      successfulResponseHandler: r,
      abortSignal: i,
      fetch: a,
    }),
  ry = async ({
    url: e,
    headers: t = {},
    body: n,
    successfulResponseHandler: o,
    failedResponseHandler: r,
    abortSignal: i,
    fetch: a = uI(),
  }) => {
    try {
      let s = await a(e, {
          method: "POST",
          headers: Gh(t, `ai-sdk/provider-utils/${qh}`, Wh()),
          body: n.content,
          signal: i,
        }),
        c = ai(s);
      if (!s.ok) {
        let u;
        try {
          u = await r({ response: s, url: e, requestBodyValues: n.values });
        } catch (l) {
          throw Mr(l) || oe.isInstance(l)
            ? l
            : new oe({
                message: "Failed to process error response",
                cause: l,
                statusCode: s.status,
                url: e,
                responseHeaders: c,
                requestBodyValues: n.values,
              });
        }
        throw u.value;
      }
      try {
        return await o({ response: s, url: e, requestBodyValues: n.values });
      } catch (u) {
        throw u instanceof Error && (Mr(u) || oe.isInstance(u))
          ? u
          : new oe({
              message: "Failed to process successful response",
              cause: u,
              statusCode: s.status,
              url: e,
              responseHeaders: c,
              requestBodyValues: n.values,
            });
      }
    } catch (s) {
      throw Kh({ error: s, url: e, requestBodyValues: n.values });
    }
  };
function uO(e) {
  return e;
}
function cO(e) {
  return { ...e, type: "dynamic" };
}
function lO({ id: e, inputSchema: t }) {
  return ({
    execute: n,
    outputSchema: o,
    needsApproval: r,
    toModelOutput: i,
    onInputStart: a,
    onInputDelta: s,
    onInputAvailable: c,
    ...u
  }) => ({
    type: "provider",
    isProviderExecuted: !1,
    id: e,
    args: u,
    inputSchema: t,
    outputSchema: o,
    execute: n,
    needsApproval: r,
    toModelOutput: i,
    onInputStart: a,
    onInputDelta: s,
    onInputAvailable: c,
  });
}
function dO({
  id: e,
  inputSchema: t,
  outputSchema: n,
  supportsDeferredResults: o,
}) {
  return ({ onInputStart: r, onInputDelta: i, onInputAvailable: a, ...s }) => ({
    type: "provider",
    isProviderExecuted: !0,
    id: e,
    args: s,
    inputSchema: t,
    outputSchema: n,
    onInputStart: r,
    onInputDelta: i,
    onInputAvailable: a,
    supportsDeferredResults: o,
  });
}
async function fO(e) {
  return (typeof e == "function" && (e = e()), Promise.resolve(e));
}
function pO({ part: e }) {
  if (Kk(e.mediaType)) return e.mediaType;
  if (e.data.type === "data") {
    let t = Jk({ data: e.data.data, topLevelType: Bk(e.mediaType) });
    if (t) return t;
    throw new Ia({
      functionality: `file of media type "${e.mediaType}" must specify subtype since it could not be auto-detected`,
    });
  }
  throw new Ia({
    functionality: `file of media type "${e.mediaType}" must specify subtype since it is not passed as inline bytes`,
  });
}
function vO({ reference: e, provider: t }) {
  let n = e[t];
  if (n != null) return n;
  throw new gm({ provider: t, reference: e });
}
var hO =
  ({
    maxRetries: e = 2,
    initialDelayInMs: t = 2e3,
    backoffFactor: n = 2,
    abortSignal: o,
    shouldRetry: r,
    getDelayInMs: i = ({ exponentialBackoffDelay: s }) => s,
    createRetryError: a = ({ message: s }) => new Error(s),
  }) =>
  async (s) =>
    ny(s, {
      maxRetries: e,
      delayInMs: t,
      backoffFactor: n,
      abortSignal: o,
      shouldRetry: r,
      getDelayInMs: i,
      createRetryError: a,
    });
async function ny(
  e,
  {
    maxRetries: t,
    delayInMs: n,
    backoffFactor: o,
    abortSignal: r,
    shouldRetry: i,
    getDelayInMs: a,
    createRetryError: s,
  },
  c = [],
) {
  try {
    return await e();
  } catch (u) {
    if (Mr(u) || t === 0) throw u;
    let l = ci(u),
      d = [...c, u],
      f = d.length;
    if (f > t)
      throw s({
        message: `Failed after ${f} attempts. Last error: ${l}`,
        reason: "maxRetriesExceeded",
        errors: d,
      });
    if ((await i(u)) && f <= t)
      return (
        await Rk(a({ error: u, exponentialBackoffDelay: n }), {
          abortSignal: r,
        }),
        ny(
          e,
          {
            maxRetries: t,
            delayInMs: o * n,
            backoffFactor: o,
            abortSignal: r,
            shouldRetry: i,
            getDelayInMs: a,
            createRetryError: s,
          },
          d,
        )
      );
    throw f === 1
      ? u
      : s({
          message: `Failed after ${f} attempts with non-retryable error: '${l}'`,
          reason: "errorNotRetryable",
          errors: d,
        });
  }
}
var cI = new TextDecoder();
async function iy({ response: e, url: t }) {
  return cI.decode(await ew({ response: e, url: t }));
}
var $O =
    ({ errorSchema: e, errorToMessage: t, isRetryable: n }) =>
    async ({ response: o, url: r, requestBodyValues: i }) => {
      let a = await iy({ response: o, url: r }),
        s = ai(o);
      if (a.trim() === "")
        return {
          responseHeaders: s,
          value: new oe({
            message: o.statusText,
            url: r,
            requestBodyValues: i,
            statusCode: o.status,
            responseHeaders: s,
            responseBody: a,
            isRetryable: n?.(o),
          }),
        };
      try {
        let c = await aI({ text: a, schema: e });
        return {
          responseHeaders: s,
          value: new oe({
            message: t(c),
            url: r,
            requestBodyValues: i,
            statusCode: o.status,
            responseHeaders: s,
            responseBody: a,
            data: c,
            isRetryable: n?.(o, c),
          }),
        };
      } catch {
        return {
          responseHeaders: s,
          value: new oe({
            message: o.statusText,
            url: r,
            requestBodyValues: i,
            statusCode: o.status,
            responseHeaders: s,
            responseBody: a,
            isRetryable: n?.(o),
          }),
        };
      }
    },
  _O =
    (e) =>
    async ({ response: t }) => {
      let n = ai(t);
      if (t.body == null) throw new Xf({});
      return { responseHeaders: n, value: sI({ stream: t.body, schema: e }) };
    },
  bO =
    (e) =>
    async ({ response: t, url: n, requestBodyValues: o }) => {
      let r = await iy({ response: t, url: n }),
        i = await ty({ text: r, schema: e }),
        a = ai(t);
      if (!i.success)
        throw new oe({
          message: "Invalid JSON response",
          cause: i.error,
          statusCode: t.status,
          responseHeaders: a,
          responseBody: r,
          url: n,
          requestBodyValues: o,
        });
      return { responseHeaders: a, value: i.value, rawValue: i.rawValue };
    };
function _a(e) {
  if (e == null) return !0;
  let t = typeof e;
  return t === "string" || t === "number" || t === "boolean"
    ? !0
    : t === "function" || t === "symbol" || t === "bigint"
      ? !1
      : Array.isArray(e)
        ? e.every(_a)
        : Object.getPrototypeOf(e) === Object.prototype
          ? Object.values(e).every(_a)
          : !1;
}
function xO(e) {
  let t = {};
  for (let [n, o] of Object.entries(e.config))
    if (n === "headers") {
      let r = lI(o);
      _a(r) && (t[n] = r);
    } else _a(o) && (t[n] = o);
  return { modelId: e.modelId, config: t };
}
function lI(e) {
  let t = e;
  if ((typeof e == "function" && (t = e()), t instanceof Promise))
    throw new Error("Promise returned from resolveSync");
  return t;
}
var kO = new TextDecoder();
function wO(e) {
  return e?.replace(/\/$/, "");
}
function IO(e) {
  return e != null && typeof e.execute == "function";
}
function dI(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
async function* SO({ tool: e, input: t, options: n }) {
  let o = e.execute(t, n);
  if (dI(o)) {
    let r;
    for await (let i of o) ((r = i), yield { type: "preliminary", output: i });
    yield { type: "final", output: r };
  } else yield { type: "final", output: await o };
}
export {
  K as a,
  oe as b,
  Xf as c,
  ci as d,
  li as e,
  fI as f,
  mI as g,
  Jr as h,
  Br as i,
  pI as j,
  gI as k,
  vI as l,
  gm as m,
  hI as n,
  rt as o,
  Ia as p,
  yI as q,
  $I as r,
  _h as s,
  Uk as t,
  Ek as u,
  IP as v,
  SP as w,
  lf as x,
  Lk as y,
  zP as z,
  PP as A,
  OP as B,
  Rk as C,
  jP as D,
  Jk as E,
  Bk as F,
  Kk as G,
  Vh as H,
  Be as I,
  TP as J,
  Qk as K,
  ew as L,
  AP as M,
  tw as N,
  UP as O,
  Mr as P,
  Wh as Q,
  ow as R,
  Gh as S,
  LP as T,
  sw as U,
  RP as V,
  VP as W,
  FP as X,
  JP as Y,
  BP as Z,
  KP as _,
  WP as $,
  GP as aa,
  Xh as ba,
  tO as ca,
  ba as da,
  Qw as ea,
  iI as fa,
  oI as ga,
  ff as ha,
  ty as ia,
  sI as ja,
  iO as ka,
  aO as la,
  sO as ma,
  uO as na,
  cO as oa,
  lO as pa,
  dO as qa,
  fO as ra,
  pO as sa,
  vO as ta,
  hO as ua,
  $O as va,
  _O as wa,
  bO as xa,
  xO as ya,
  wO as za,
  IO as Aa,
  SO as Ba,
};
