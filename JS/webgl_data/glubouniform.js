import { UniformBuilder, _apply, _build, updateUbo, clean } from "./gluniform.js";
import { compareSafe, partialApply } from "../.fable/fable-library.3.0.0/Util.js";
import { ofArray, map, empty } from "../.fable/fable-library.3.0.0/List.js";
import { equalsWith } from "../.fable/fable-library.3.0.0/Array.js";
import { emptyFloat32Array } from "../js/typedarray_utils.js";
import { Data_GlUniformData } from "./webgl_data.js";
import { GlProgram_getUniform, GlProgram_emptyUniformInfo } from "../webgl_core/program_utils.js";

function isActiveUbo(ubo) {
    return ubo.Info.BlockIndex >= 0;
}

function init(data) {
    if (data.Link == null) {
        const matchValue_1 = data.ParentUbo;
        if (matchValue_1 == null) {
        }
        else {
            const ubo = matchValue_1;
            clean(data);
            if (data.ChildUniforms.length > 0) {
                data.ChildUniforms.forEach((arg) => {
                    const value = init(arg);
                    void value;
                });
            }
            else if (isActiveUbo(ubo)) {
                let value_1;
                const matchValue_2 = data.RootUniform;
                if (matchValue_2 == null) {
                    value_1 = data.Value;
                }
                else {
                    const root = matchValue_2;
                    value_1 = root.Value;
                }
                updateUbo(value_1, ubo, data);
            }
        }
    }
    return data;
}

export function createFrom(info, props, parentUbo, parentObject) {
    const doCreate = (props_1, info_1, rootUniform) => {
        const createChild = (info_2) => partialApply(1, doCreate, [empty(), info_2]);
        let dataArray;
        const matchValue = info_1.Children;
        if ((!equalsWith(compareSafe, matchValue, null)) ? (matchValue.length === 0) : false) {
            const arrayBuffer = parentUbo.Data.buffer;
            const length = (info_1.ElementCount * info_1.Length) | 0;
            dataArray = info_1.TypeInfo.TypeArrayCreator.Create(arrayBuffer, info_1.Offset, length);
        }
        else {
            dataArray = emptyFloat32Array;
        }
        return _build(_apply(props_1, new UniformBuilder(void 0, map(createChild, ofArray(info_1.Children)), new Data_GlUniformData(0, info_1, true, dataArray, 0, parentObject, parentUbo, rootUniform, [], void 0, empty()))));
    };
    return init(doCreate(props, info, void 0));
}

function createEmpty(name, parentUbo, rootUniform, parentObject) {
    return new Data_GlUniformData(0, GlProgram_emptyUniformInfo(name), false, emptyFloat32Array, 0, parentObject, parentUbo, rootUniform, [], void 0, empty());
}

export function create(name, props, parentUbo, parentObject) {
    const matchValue = GlProgram_getUniform(name, parentObject.ProgramInfo);
    if (matchValue == null) {
        return createEmpty(name, parentUbo, void 0, parentObject);
    }
    else {
        const info = matchValue;
        return createFrom(info, props, parentUbo, parentObject);
    }
}

