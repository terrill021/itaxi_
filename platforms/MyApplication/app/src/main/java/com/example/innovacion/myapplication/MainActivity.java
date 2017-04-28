package com.example.innovacion.myapplication;

import android.Manifest;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    Button call;
    TextView textView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = (TextView) findViewById(R.id.textView);
    }


    public void buttonClickFunction(View v) {
        String phnum = "+573135483736";

       try {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Llamando a " + phnum, Toast.LENGTH_LONG).show();
/*
                Intent callIntent = new  Intent(Intent.ACTION_CALL, Uri.parse(phnum));
                callIntent.setData(Uri.parse("tel:" + phnum));
                startActivity(callIntent);
                */
                startActivity(new Intent(Intent.ACTION_DIAL).setData(Uri.parse("tel:"+phnum)));

                return;
            }

           int permissionCheck = ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE);

           if (permissionCheck != PackageManager.PERMISSION_GRANTED) {
               String [] permisos =new String[]{Manifest.permission.CALL_PHONE, "123"};
               ActivityCompat.requestPermissions( this, permisos );
           } else {
               startActivity(new Intent(Intent.ACTION_CALL).setData(Uri.parse("tel:12345678901")));
           }

        }catch (Exception e){
            textView.setText(e.getMessage() + e.getCause());
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {

            case 123:
                if ((grantResults.length > 0) && (grantResults[0] == PackageManager.PERMISSION_GRANTED)) {

                } else {
                    Log.d("TAG", "Call Permission Not Granted");
                }
                break;

            default:
                break;
        }
    }
}