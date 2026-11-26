# Colorir

Transforma uma foto em desenho para colorir, direto no navegador.

- **Com IA:** modelo [Informative Drawings](https://huggingface.co/rocca/informative-drawings-line-art-onnx) (~17 MB, ONNX) rodando via onnxruntime-web (WebAssembly, só CPU). O modelo é baixado na primeira vez e fica em cache no navegador.
- **Sem IA:** filtro XDoG, para comparação ou uso offline.
- Ajuste de limiar, espessura e limpeza de pontinhos; pintura com balde, desfazer; exportar PNG e imprimir.

A foto não sai do aparelho: todo o processamento é local.

## Uso offline (PWA)

O app pode ser instalado na tela inicial e funciona sem internet:

1. Abra o app com internet e toque em **Preparar para usar offline** (ou gere um desenho com IA).
2. Quando aparecer **Pronto para usar sem internet**, já pode usar em modo avião.

O `sw.js` guarda a página e a biblioteca de IA; o modelo fica no cache `colorir-modelo-v1`.
Ao alterar arquivos do app, aumente `VERSION` no `sw.js` para os aparelhos receberem a atualização.
