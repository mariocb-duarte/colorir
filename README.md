# Colorir

Transforma uma foto em desenho para colorir, direto no navegador.

- **Com IA:** modelo [Informative Drawings](https://huggingface.co/rocca/informative-drawings-line-art-onnx) (~17 MB, ONNX) rodando via onnxruntime-web (WebAssembly, só CPU). O modelo é baixado na primeira vez e fica em cache no navegador.
- **Sem IA:** filtro XDoG, para comparação ou uso offline.
- Ajuste de limiar, espessura e limpeza de pontinhos; pintura com balde, desfazer; exportar PNG e imprimir.

A foto não sai do aparelho: todo o processamento é local.
