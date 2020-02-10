import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn import metrics


class StockPrediction(object):
    """"
    Machine learning using Linear Regression to analyze time vs high prices

    Linear regression is a method used to model a relationship between a depedent variable (y) and an independent variable (x).

    Date will be the independent variable - or rather the index correspending to the date will be. (x)
    High will be the dependent variable. (y)

    https://towardsdatascience.com/a-beginners-guide-to-linear-regression-in-python-with-scikit-learn-83a8f7ae2b4f

    https://programmingforfinance.com/2018/01/predicting-stock-prices-with-linear-regression/
    """

    def __init__(self):
        pass

    def get_data(self, symbol):
        """
        Pulls data regarding the symbol in csv format and use pandas to parse the csv data to prepare a dataset.
        """
        url = "https://sandbox.iexapis.com/stable/stock/{}/chart/2y?token=Tpk_3229f06c7e5944b5a0fecfd7ed49ebed&format=csv".format(
            symbol)

        self.data = pd.read_csv(url)
        # print self.data.shape
        # print self.data.describe()
        # print self.data

    def show_train_plot(self, x_train, y_train, regressor):
        """
        Shows the predicted values from the linear regression
        """
        plt.scatter(x_train, y_train, color='grey', label='Actual Price')
        plt.plot(x_train, regressor.predict(x_train), color='blue',
                 linewidth=3, label='Predicted Price')
        plt.title('Linear Regression | Time vs. Price')
        plt.legend()
        plt.xlabel('Date')
        plt.show()

    def predict(self):
        """
        Use linear regression to analyze the dataset.
        """
        # Prepare the data for linear regression
        dates = self.data.index.tolist()
        highs = self.data['high'].values

        dates = np.reshape(dates, (len(dates), 1))
        highs = np.reshape(highs, (len(highs), 1))

        # Use LinearRegression
        regressor = LinearRegression()

        # Split the data for the testing and training set
        x_train, x_test, y_train, y_test = train_test_split(
            dates, highs, test_size=0.5, random_state=0)

        regressor.fit(x_train, y_train)

        # Show prediction
        # self.show_train_plot(x_train, y_train, regressor)
        prediction = regressor.predict(x_train)

        df = pd.DataFrame({
            'Actual': y_train.flatten(),
            'Predicted': prediction.flatten()
        })
        print df


if __name__ == "__main__":
    sp = StockPrediction()
    sp.get_data("HUBS")
    sp.predict()
