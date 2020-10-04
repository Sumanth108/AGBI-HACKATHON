from flask import Flask,request
from flask_restful import Api, Resource, reqparse, fields
import tensorflow as tf
import numpy as np
from skimage.transform import resize

from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
app = Flask(__name__)
api = Api(app)

class Predict(Resource):
    def get(self):
        return "app running"
    def post(self):
        model = tf.keras.models.load_model('./model.h5')
        img = plt.imread(request.files['file'])
        img= resize(img ,(224, 224))
        x = np.array(img, dtype=np.float32)
        x = np.expand_dims(x, axis=0)
        x = x/255.0
        pred=model.predict(x)
        print(pred[0][0])
        ret_obj={'prediction':str(pred[0][0])}
        return ret_obj

api.add_resource(Predict, "/")
if __name__ == "__main__":
    app.run(debug=True)
