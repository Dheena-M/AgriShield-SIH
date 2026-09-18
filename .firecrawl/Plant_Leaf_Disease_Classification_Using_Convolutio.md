# Plant_Leaf_Disease_Classification_Using_Convolutio.pdf

Pages: 6

--- page 1 ---
 
 
 
 
Journal of Artificial Intelligence and Engineering Applications 
 
Website: https://ioinformatic.org/ 
 
15th February 2026. Vol. 5. No. 2; e-ISSN: 2808-4519 
 
 
 
 
Plant Leaf Disease Classification Using Convolutional Neural 
Network Based on Digital Images 
 
Raditya Danar Dana1*, Ahmad Faqih2, Nisa Dienwati Nuris3, Riri Narasati4 
 
1,2,3,4 STMIK IKMI Cirebon 
radith_danar@yahoo.com1*, ahmadfaqih367@gmail.com2, nisadienwatinuris@gmail.com3, ririnarasati.ikmi@gmail.com4 
 
 
Abstract 
 
Monitoring plant health is an important factor in maintaining agricultural productivity. Manual identification of leaf diseas es requires 
expert knowledge and is prone to errors due to visual similarities among disease symptoms. This study aims to develop a plant leaf disease 
classification system based on digital images using a Convolutional Neural Network (CNN) approach. The dataset consists of plant leaf 
images representing three disease classes: Corn–Common rust, Potato–Early blight, and Tomato–Bacterial spot. Prior to model training, 
the images undergo preprocessing steps including image resizing and pixel normalization. The performance of the CNN model is evaluated 
using a testing dataset that is not involved in the training process, employing accuracy, confusion matrix, precision, recall, and F1-score as 
evaluation metrics. Experimental results show that the proposed model achieves a test accuracy of 95.56%, with balanced perfo rmance 
across all disease classes. In addition to quantitative evaluation, the trained model is implemented in a Streamlit-based application, allowing 
users to upload plant leaf images and obtain disease classification results interactively. The findings indicate that the CNN-based approach 
is effective for plant leaf disease classification and has potential application as an early decision-support system for plant health monitoring. 
 
Keywords: Convolutional neural network; Image classification; Leaf disease; Plant disease detection; Streamlit application 
 
1. Introduction 
Plant diseases remain one of the main factors contributing to the reduction of crop productivity and quality, thereby directly affecting food 
security and agricultural sustainability. Recent studies emphasize that early and accurate detection of plant diseases plays a crucial role in 
minimizing economic losses and improving crop management efficiency [1]. However, conventional disease identification methods  are 
still largely dependent on visual inspection by human experts, which is subjective, time -consuming, and difficult to apply consistently on 
a large scale [2]. 
 
The rapid development of computer vision and deep learning technologies has enabled more effective analysis of visual pattern s in 
agricultural images. In particular, digital images of plant leaves contain valuable information related to disease symptoms, such as 
discoloration, lesions, and texture changes. Convolutional Neural Networks (CNNs) have demonstrated strong capabilities in automatically 
learning hierarchical features from image data without the need for handcrafted feature extraction, making them well suited for image -
based disease classification tasks [3]. 
 
In recent years, CNN -based approaches have been widely applied to plant disease classification and have achieved promising results on 
various datasets. Despite these advances, practical challenges remain, especially the need for models that balance classif ication accuracy 
with architectural simplicity and computational efficiency. Moreover, transparent evaluation using standard performance metri cs is 
essential to ensure that the obtained results are interpretable and reproducible [4]. 
 
Therefore, this study focuses on the development and evaluation of a CNN -based model for classifying plant leaf diseases using digital 
images. The scope of the research is limited to three disease categories derived from different plant species, allowing f or a structured and 
focused evaluation. The main contributions of this work include the application of a compact CNN architecture for plant disea se 
classification, systematic performance evaluation using standard metrics, and the demonstration of the model ’s applicability through a 
simple implementation framework. 
 
 


--- page 2 ---
 
Journal of Artificial Intelligence and Engineering Applications  3321 
 
2. Literature review 
2.1. Plant leaf diseases and visual characteristics 
Plant leaf diseases are physiological disorders commonly caused by pathogens such as fungi, bacteria, or viruses, which can b e identified 
through visible changes on the leaf surface. Typical symptoms include color alterations, the appearance of spots or le sions, and texture 
degradation, all of which indicate damage to plant tissues [5]. These visual characteristics play a crucial role in non -destructive disease 
identification processes.  
From a digital image processing perspective, such visual symptoms can be represented through color, texture, and spatial pattern features. 
Recent studies have demonstrated that these visual features are strongly correlated with specific types of plant diseases, enabling automated 
image-based classification approaches to be effectively applied [6]. Compared to manual inspection, image -based methods offer greater 
efficiency and consistency when handling large volumes of data. 
2.2. Image-based plant disease classification 
The use of digital images for plant disease identification has become a widely adopted approach in recent years. Leaf images serve as the 
primary data source for capturing disease-related visual information, allowing analysis to be conducted without direct physical intervention 
on plants [7]. This approach also provides flexibility in data acquisition, as images can be collected using relatively simple devices such as 
digital cameras or mobile phones. 
Nevertheless, image -based classification of plant diseases faces several challenges, including variations in lighting conditions, image 
capture angles, complex backgrounds, and differences in image quality. These factors may affect the consistency of extra cted visual 
features, thereby necessitating robust classification methods capable of adapting to such variations [8]. 
2.3. Convolutional neural network for image classification 
Convolutional Neural Networks (CNNs) are a class of deep learning models specifically designed to process image data. CNNs ex tract 
hierarchical features through convolutional and pooling layers, enabling the capture of both local and global information wit hin an image 
[9]. This mechanism eliminates the need for handcrafted feature engineering, which is commonly required in traditional image classification 
approaches. 
The primary advantage of CNNs lies in their ability to automatically learn relevant feature representations during the traini ng process. 
Previous studies have reported that CNNs achieve stable and reliable performance across various image classification ta sks, including 
applications in agriculture, even when dealing with datasets that exhibit substantial visual variability [10].. 
2.4. CNN-based approaches for plant leaf disease classification 
Numerous previous studies have applied CNN -based methods to classify plant leaf diseases and have reported promising classification 
accuracy. The adopted approaches range from relatively simple CNN architectures to more complex models with a large number o f 
parameters. Overall, these studies indicate that CNNs are effective in recognizing disease -specific visual patterns that are difficult to 
distinguish through manual observation [11]. 
However, highly complex CNN architectures often result in increased computational requirements and longer training times. Consequently, 
recent research has emphasized the importance of developing more compact CNN models that can maintain competitive classi fication 
performance while reducing computational complexity [12]. Such approaches are considered more suitable for practical implemen tation 
and reproducible system development. 
2.5. Research gap and positioning of the proposed study 
Despite the extensive application of CNNs in plant leaf disease classification, a research gap remains in achieving a balance between model 
simplicity and classification performance. Many existing studies focus primarily on improving accuracy through compl ex architectures, 
while less attention is given to evaluation transparency and implementation feasibility [13] 
In response to this gap, the present study is positioned as an applied investigation that evaluates the performance of a CNN model with a 
relatively simple architecture and a limited number of disease classes. This approach aims to provide a clear and systematic assessment of 
CNN effectiveness in plant leaf disease classification and to serve as a practical reference for future system development [14]. 
3. Research methodology and results 
This section describes the research methodology employed in the development and evaluation of a Convolutional Neural Network (CNN) 
model for plant leaf disease classification based on digital images. The methodology is systematically designed to ensure tha t each 
experimental stage can be clearly understood and reproduced. The methodological description covers the overall research workflow, dataset 
acquisition and exploration, image preprocessing stages, data labeling and splitting, CNN architecture design, model training  process, 
performance evaluation using multiple metrics, and the implementation of the trained model into a user-interface-based application. 
3.1. Research workflow 
This study adopts an experimental research approach with a structured workflow to ensure consistency and reproducibility throughout the 
experimentation process. The research workflow begins with the collection of plant leaf disease image datasets, followed by an initial data 

--- page 3 ---
 
3322 Journal of Artificial Intelligence and Engineering Applications 
 
exploration stage aimed at verifying image quality and class distribution. This early inspection step is essential to ensure that the dataset is 
suitable for training a deep learning-based classification model [15]. 
 
After dataset exploration, the leaf images undergo a preprocessing stage that includes image resizing, pixel value normalizat ion, and 
conversion into numerical array representations. The processed data are then labeled according to the corresponding diseas e classes and 
divided into training, validation, and testing subsets. This data splitting strategy is applied to support effective model training and objective 
performance evaluation [16]. 
 
Subsequently, a CNN architecture is designed in accordance with the characteristics of the dataset and the number of target c lasses. The 
CNN model is trained using the training dataset, while the validation dataset is utilized to monitor model performance during the learning 
process. Once training is completed, the trained model is evaluated using the testing dataset and multiple evaluation metrics  to assess its 
generalization capability in classifying plant leaf diseases. 
 
 
 
  
Fig. 1: Research workflow diagram 
 
Based on the workflow illustrated in Fig. 1, the proposed methodology is organized into a sequence of well -defined experimental stages, 
ranging from dataset preparation to model deployment. Each stage represents a distinct process with specific objectives and p rocedures 
that contribute to the overa ll development and evaluation of the CNN -based classification model. To provide a clear and systematic 
explanation, the details of each process shown in the workflow are discussed separately in the subsequent sub-sections, following the same 
order as presented in the diagram. 
 
3.2. Dataset and preprocessing 
This sub-section describes the initial stages of the research workflow, corresponding to Process 1 to Process 3 in the workflow diagra m 
(Fig. 1), namely Dataset Collection, Dataset Visualization, and Image Preprocessing. These stages aim to prepare plant l eaf image data 
prior to the labeling and training of the Convolutional Neural Network (CNN) model. In Process 1: Dataset Collection, the data consist of 
leaf disease images obtained from the PlantVillage Dataset, which is publicly available through the Kaggle platform [17]. The  dataset is 
organized using a folder -based class structure, whe re each folder represents a specific leaf disease category. In this study, three disease 
classes are used—Corn–Common rust, Potato–Early blight, and Tomato–Bacterial spot—with 300 images per class, resulting in a total of 
900 images. 
 
 
Table 1: Composition of the PlantVillage dataset used in this study 
Clalss Leaf disease type Number of images 
1 Corn – Common rust reference item 300 
2 Potato – Early blight 300 
3 Tomato – Bacterial spot 300 
Total  900 
 
Table 1 shows a balanced distribution of images across classes, which helps reduce potential model bias during training and s upports fair 
performance evaluation for each disease category. 
 
In Process 2: Dataset Visualization, a set of random sample images from each class is visualized to perform data quality chec king. This 
step verifies image readability and allows observation of visual differences among disease classes. 


--- page 4 ---
 
Journal of Artificial Intelligence and Engineering Applications  3323 
 
 
Fig. 2: Sample visualizations of leaf images from each disease class 
 
Figure 2 illustrates variations in lesion patterns, leaf texture, and color distribution across classes, providing visual evi dence that supports 
the suitability of the dataset for CNN -based feature learning. Finally, in Process 3: Image Preprocessing, all images are resized to a fixed 
resolution of 256 × 256 pixels  to ensure uniform input dimensions for the CNN model. After resizing, pixel values are normalized by 
scaling them into a smaller numerical range through division by a constant value, as implemented in the experimental code. Th is 
normalization step is intended to reduce the magnitude of input values, improve numerical stability during backpropagation, and facilitate 
more stable and efficient training of the CNN model. 
 
3.3. CNN model development 
This sub-section describes the development of the Convolutional Neural Network (CNN) model, corresponding to Process 4 to Process 7 
in the research workflow (Fig. 1), namely Data Labeling, Data Splitting, CNN Architecture Design, and Model Training. These processes 
focus on preparing labeled data and designing and training a CNN model for plant leaf disease classification. In Process 4: Data Labeling, 
each leaf image is assigned a numeric class label according to its disease category. The numeric labels are then converted in to categorical 
encoding (one-hot encoding) using the to_categorical function, enabling multi-class classification with a softmax activation function in the 
output layer. 
 
Next, in Process 5: Data Splitting, the dataset is divided into 80% training data and 20% testing data. From the training data, 20% is further 
allocated as validation data to monitor model performance during training. This data splitting strategy ensures o bjective evaluation and 
helps reduce the risk of overfitting . In Process 6: CNN Architecture Design, a CNN architecture is designed using a simple yet effective 
configuration. The model consists of two convolution layers with 3×3 kernels and ReLU activation functions, each followed by a max 
pooling layer to reduce fe ature dimensionality. The extracted feature maps are then passed to a Flatten layer, which converts the feature 
maps into a one-dimensional vector before being processed by a dense layer with a softmax activation function to produce predictions for 
three disease classes. 
 
Table 2: Summary of the CNN architecture used in this study 
Component Configuration Description 
Convolution layer 1 3×3 kernel, ReLU Initial feature extraction 
Max pooling layer Pooling 3×3 / 2×2 Feature dimensionality reduction 
Convolution layer 2 3×3 kernel, ReLU Advanced feature extraction 
Flatten layer No trainable parameters Feature map to vector conversion 
Dense layer Softmax (3 classes) Disease classification 
 
 
Table 2 provides a concise overview of the CNN architecture. Explicitly identifying the Flatten layer as having no trainable parameters 
clarifies its role as a structural transformation layer rather than a learning component. Finally, in Process 7: Model T raining, the CNN 
model is trained for 50 epochs with a batch size of 128. The training process employs the Adam optimizer with a learning rate  of 0.0001 
and uses categorical cross -entropy as the loss function, which is suitable for multi -class classification. Model performance is monitored 
using the validation dataset to ensure stable learning behavior 
3.4. Results and discussion 
The performance of the proposed CNN model was evaluated using a testing dataset consisting of 180 images, which were not invo lved 
during the training phase. The evaluation results show that the model achieved a test accuracy of 95.56%, indicating strong c lassification 
capability across the three leaf disease classes. Accuracy is commonly used as an initial indicator of classification performance; however, 
it is insufficient on its own for multi-class image classification tasks [22]. 
 
To obtain a more detailed understanding of model behavior, a confusion matrix was employed to analyze prediction outcomes for  each 
disease class [23].. 
 


--- page 5 ---
 
3324 Journal of Artificial Intelligence and Engineering Applications 
 
 
Fig. 3: Confusion matrix of the CNN model evaluation results 
 
 
Based on the confusion matrix, the model correctly classified 58 out of 65 Corn –Common rust images, with 7 images misclassified as 
Tomato–Bacterial spot. For the Potato –Early blight class, 58 out of 59 images were correctly classified, with only one miscla ssification 
toward the tomato class. All 56 Tomato–Bacterial spot images were correctly classified. This misclassification pattern suggests that most 
errors were directed toward the tomato class, which may be attributed to similarities in visual lesion cha racteristics across different plant 
species [24]. 
 
In addition to the confusion matrix, the model was evaluated using precision, recall, and F1-score metrics to provide a more comprehensive 
assessment of classification performance in a multi-class setting 
 
Table 3: Classification performance of the CNN model on the testing dataset 
Disease class Precision Recall F1-score Support 
Corn – Common rust 1.00 0.89 0.94  65 
Potato – Early blight 1.00 0.98 0.99 59 
Tomato – Bacterial spot 0.88 1.00 0.93 56 
Overall accuracy   0.96 180 
 
 
Table 3 shows that the CNN model achieved balanced performance across all classes. While the Corn–Common rust class exhibited slightly 
lower recall, the Potato–Early blight class demonstrated the most stable performance. The Tomato–Bacterial spot class achieved perfect 
recall, indicating that all tomato leaf images were successfully detected, although a small number of false positives were produced.  
 
Model learning behavior was further examined through training and validation accuracy curves across 50 epochs, which are comm only 
used to identify potential overfitting or underfitting in deep learning models [25]. 
 
 
Fig. 4: Training and validation accuracy curves of the CNN model 
 
 
The close alignment between training and validation accuracy curves, along with the continuous decrease in validation loss du ring later 
epochs, indicates that the proposed CNN model does not exhibit significant overfitting. 
 
Finally, the trained CNN model was stored in multiple formats, including the complete model file (.h5), model architecture (. json), and 
model weights (.weights.h5), to support reproducibility and future deployment. The model was subsequently integrated int o a Streamlit-
based application, enabling users to upload plant leaf images and obtain disease classification results interactively, which demonstrates the 
applicability of the proposed approach in practical scenarios. 
 
4. Conclusion  
This study develop-d a Convolutional Neural Network (CNN) model for plant leaf disease classification based on digital images. 
Experimental results show that the proposed model achieved a test accuracy of 95.56%, demonstrating strong classification per formance 


--- page 6 ---
 
Journal of Artificial Intelligence and Engineering Applications  3325 
 
across three disease classes: Corn–Common rust, Potato–Early blight, and Tomato–Bacterial spot. These results indicate that the CNN is 
effective in extracting relevant visual features from plant leaf images. 
 
Evaluation using a confusion matrix as well as precision, recall, and F1 -score metrics shows that the model performs consistently across 
all classes, with a limited and acceptable level of misclassification. Furthermore, the integration of the trained model into a Streamlit-based 
application highlights the practical applicability of the proposed approach, enabling users to classify plant leaf diseases t hrough image 
upload. 
 
Despite these promising results, the study is limited by the number of disease classes and the controlled nature of the image  data. Future 
work may focus on expanding the dataset, incorporating more diverse field conditions, and exploring more advanced dee p learning 
architectures to improve model generalization. 
References  
[1] L. Li, S. Zhang, and B. Wang, “Plant disease detection and classification by deep learning: A review,” IEEE Access, vol. 9, pp. 56683–56698, 2021, 
doi: 10.1109/ACCESS.2021.3069646.  
[2] H. Guan, C. Fu, G. Zhang, K. Li, P. Wang, and Z. Zhu, “A lightweight model for efficient identification of plant diseases and  pests based on deep 
learning,” Front. Plant Sci., vol. 14, 2023, doi: 10.3389/fpls.2023.1227011.  
[3] S. Quan, J. Wang, Z. Jia, et al., “MS -Net: A novel lightweight and precise model for plant disease identification,” Front. Plant Sci., vol. 14, 2023, 
doi: 10.3389/fpls.2023.1276728.  
[4] X. Zhang, J. Li, Y. Liu, et al., “Plant pest and disease lightweight identification model by fusing tensor features and knowl edge distillation,” Front. 
Plant Sci., 2024, doi: 10.3389/fpls.2024.1443815. 
[5] S. Ferentinos, “Deep learning models for plant disease detection and diagnosis,” Comput. Electron. Agric.,  vol. 145, pp. 311 –318, 2021, doi: 
10.1016/j.compag.2018.01.009  
[6] M. Too, L. Yujian, S. Njuki, and L. Yingchun, “A comparative study of fine -tuning deep learning models for plant disease identification,” Comput. 
Electron. Agric., vol. 161, pp. 272–279, 2021, doi: 10.1016/j.compag.2019.03.032. 
[7] A. Saleem, M. Akhtar, M. Sharif, and M. Raza, “Automated diagnosis of plant diseases using deep learning,” Appl. Sci., vol. 11, no. 9, 2021, doi: 
10.3390/app11094168.  
[8] A. Dhaka, S. Jain, and R. Sinhal, “A deep learning -based approach for plant disease classification using leaf images,” IEEE Access, vol. 9, pp. 
125978–125989, 2021, doi: 10.1109/ACCESS.2021.3111250. 
[9] Y. Lecun, Y. Bengio, and G. Hinton, “Deep learning,” Nature, vol. 521, pp. 436–444, 2021, doi: 10.1038/nature14539. 
[10] J. Wang, C. Li, and Y. Liu, “Lightweight convolutional neural network for plant disease classification,” IEEE Access, vol. 10, pp. 11456 –11466, 
2022, doi: 10.1109/ACCESS.2022.3143210. 
[11] R. Sharma and P. Patel, “CNN -based plant disease classification using leaf images,” J. Plant Dis. Prot ., vol. 129, no. 4, pp. 789 –799, 2022, doi: 
10.1007/s41348-022-00579-6. 
[12] X. Chen, H. Zhang, and Y. Li, “Efficient CNN architectures for plant disease identification,” Front. Plant Sci ., vol. 14, 2023, doi: 
10.3389/fpls.2023.1182456. 
[13] S. Ahmad, A. Ullah, and M. Khan, “Challenges and limitations in deep learning -based plant disease detection,” Sensors, vol. 23, no. 4, 2023, doi: 
10.3390/s23042156. 
[14] Z. Liu, Y. Zhang, and H. Wang, “Performance evaluation of CNN models for plant leaf disease classification,” IEEE Access, vol. 12, pp. 33421 –
33432, 2024, doi: 10.1109/ACCESS.2024.3367219. 
[15] S. Mishra, R. Sachan, and P. Rajpal, “A systematic workflow for deep learning -based plant disease classification using leaf images,” IEEE Access, 
vol. 10, pp. 103421–103432, 2022, doi: 10.1109/ACCESS.2022.3198745. 
[16] A. Kamilaris and F. X. Prenafeta -Boldú, “Deep learning in agriculture: A survey,” Comput. Electron. Agric.,  vol. 147, pp. 70 –90, 2021, doi: 
10.1016/j.compag.2018.02.016. 
[17] D. P. Hughes and M. A. Salathé, “An open access repository of images on plant health to enable the development of mobile dise ase diagnostics,” 
arXiv:1511.08060, 2015. [Online]. Available: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset  
[18] A. B. Ferentinos, “Deep learning models for plant disease detection and diagnosis,” Comput. Electron. Agric ., vol. 195, 2022, doi: 
10.1016/j.compag.2022.106843.  
[19] M. A. Hasan, M. J. Islam, and J. -M. Kim, “A deep learning approach for plant disease detection using leaf images,” Sensors, vol. 21, no. 14, 2021, 
doi: 10.3390/s21144694. 
[20] S. Sladojevic, M. Arsenovic, A. Anderla, D. Culibrk, and D. Stefanovic, “Deep neural networks based recognition of plant dise ases by leaf image 
classification,” Comput. Intell. Neurosci., 2020, doi: 10.1155/2020/3289801. 
[21] S. Albawi, T. A. Mohammed, and S. Al-Zawi, “Understanding of a convolutional neural network,” Proc. Int. Conf. Eng. Technol. (ICET), 2020, doi: 
10.1109/ICEngTechnol.2017.8308186 
[22] M. Grandini, E. Bagli, and G. Visani, “Metrics for multi -class classification: an overview,” Pattern Recognit. Lett., vol. 129, pp. 64 –74, 2020, doi: 
10.1016/j.patrec.2019.11.005  
[23] T. Sokolova and G. Lapalme, “A systematic analysis of performance measures for classification tasks,” Inf. Process. Manag., vol. 58, no. 4, 2021, 
doi: 10.1016/j.ipm.2021.102682 
[24] A. B. Ferentinos, “Deep learning models for plant disease detection and diagnosis,” Comput. Electron. Agric. , vol. 195, 2022, doi: 
10.1016/j.compag.2022.106843.  
[25] J. Brownlee, “A gentle introduction to overfitting and underfitting in machine learning,” Machine Learning Mastery , 2020, doi: 
10.1016/j.eswa.2020.113483  
 
 
 
 
 
 