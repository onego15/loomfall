# アセットとAI利用

- コード、ゲーム設計、Canvasキャラクター・庭園・UI・エフェクト、生成BGMと効果音：OpenAI Codexで制作。
- このセッションの正確な推論モデル識別子は確認できないため「未確認」とする。特定のモデルの利用を推測で記載しない。
- タイトルの背景 `assets/garden.webp`：OpenAIの組み込みimagegenで生成。内部画像モデルの識別子は未確認。
- 元の生成物を確認後、PillowでWebPへ形式変換した。タイトル背景として使用。戦闘画面はCanvasによるオリジナル描画。
- 外部ゲームのキャラクター、ステージ、音楽、配布アセットは使用していない。
- フォントは端末のシステムフォント。ゲーム本体の外部CDN依存はない。
- ソースコードはMIT。AI生成画像について第三者による独占的権利の保証はしていない。

## imagegenに渡した最終プロンプト（組み込みツール）

```text
Use case: stylized-concept. Asset type: original indie game title background, landscape 1536x1024. An exquisite dark botanical fantasy painting, a tiny ivory moth-masked cloaked silk weaver standing on a circular weathered stone loom dais in an ancient midnight garden. Three radiant teal silk threads form an enormous triangular web across the garden, catching vermilion insect spirits. Giant delicate moonflowers, fern silhouettes, carved concentric stone paths, suspended silk cocoons, luminous dust, distant eclipsed moon. Sophisticated hand-painted gouache and etched line art, art nouveau botanical ornament, painterly texture, atmospheric depth. Muted ink navy and petrol green, warm ivory and pale gold, small vermilion accents. Place main character and most detail in right half, left half dark and quiet with foliage framing, clear negative space for separate UI title overlay. Top down three-quarter isometric scenery. No text, no letters, no UI, no logo, no watermarks. Wide cinematic composition. Highly polished original art, no existing game characters.
```
