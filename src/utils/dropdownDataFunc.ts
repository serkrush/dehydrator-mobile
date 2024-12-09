import container from 'src/container';

export default function dataFunc(
    inputs,
    fieldCode?,
    needTranslation? = true,
): {label: string; value: any}[] {
    const t = container.resolve('t');
    let res: {label: string; value: any}[] = [];
    inputs.forEach(item => {
        res.push({
            label: needTranslation
                ? t(`${fieldCode != undefined ? fieldCode + '_' : ''}${item}`)
                : item,
            value: item,
        });
    });

    return res;
}
